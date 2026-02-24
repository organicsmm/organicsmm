import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Loader2,
  Plus,
  Trash2,
  Package,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ArrowLeft,
  Sparkles,
  Link2,
  AlertTriangle,
  Percent,
  Wand2,
  UserPlus,
  Bell,
  Clock,
  Repeat,
  RefreshCw,
  Brain,
  Sparkle,
  Settings2,
  Globe,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import {
  PLATFORM_CONFIG,
  DEFAULT_RATIOS,
  PLATFORM_ENGAGEMENT_TYPES,
  EngagementType,
} from '@/lib/engagement-types';

const ENGAGEMENT_ICONS: Record<EngagementType, any> = {
  views: Eye,
  likes: Heart,
  comments: MessageCircle,
  saves: Bookmark,
  shares: Share2,
  followers: UserPlus,
  subscribers: Bell,
  watch_hours: Clock,
  retweets: Repeat,
  reposts: RefreshCw,
};

export default function AdminBundles() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteBundle, setDeleteBundle] = useState<string | null>(null);

  // Fetch bundles
  const { data: bundles, isLoading } = useQuery({
    queryKey: ['admin-bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_bundles')
        .select(
          `
          *,
          items:bundle_items(
            *,
            service:services(id, name, price, min_quantity)
          )
        `
        )
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Fetch services for linking
  const { data: services } = useQuery({
    queryKey: ['admin-services-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  // Fetch services that have provider mappings (for filtered dropdown)
  const { data: mappedServiceIds } = useQuery({
    queryKey: ['mapped-service-ids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_mapping')
        .select('service_id')
        .not('service_id', 'is', null);
      if (error) throw error;

      // Return unique, non-null service IDs that have mappings
      const ids = (data || [])
        .map((m: any) => m.service_id)
        .filter(Boolean);
      return [...new Set(ids)];
    },
    enabled: !!user && isAdmin,
  });

  // Show ALL services in dropdown (not just mapped ones), deduplicated by provider_service_id
  const allServices = (() => {
    if (!services) return [];
    const seen = new Set<string>();
    return services.filter(s => {
      if (seen.has(s.provider_service_id)) return false;
      seen.add(s.provider_service_id);
      return true;
    });
  })();

  // Fetch provider accounts for rotation - always get fresh data
  const { data: providerAccounts, refetch: refetchAccounts } = useQuery({
    queryKey: ['provider-accounts-for-bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_accounts')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      console.log('[AdminBundles] Fetched provider accounts:', data?.length);
      return data;
    },
    enabled: !!user && isAdmin,
    staleTime: 0, // Always refetch to get latest accounts
    refetchOnMount: 'always',
  });

  // Create bundle mutation
  const createBundleMutation = useMutation({
    mutationFn: async (bundleData: {
      name: string;
      platform: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('engagement_bundles')
        .insert({
          name: bundleData.name,
          platform: bundleData.platform,
          description: bundleData.description,
          is_active: true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Bundle created!' });
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      setIsCreateOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Toggle bundle active
  const toggleBundleMutation = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from('engagement_bundles')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
    },
  });

  // Delete bundle
  const deleteBundleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('engagement_bundles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Bundle deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      setDeleteBundle(null);
    },
  });

  // Add item to bundle
  const addItemMutation = useMutation({
    mutationFn: async (itemData: {
      bundle_id: string;
      engagement_type: string;
      service_id?: string;
      ratio_percent: number;
      is_base: boolean;
    }) => {
      const { error } = await supabase.from('bundle_items').insert(itemData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
    },
  });

  // Delete item
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bundle_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
    },
  });

  // Update item service
  const updateItemMutation = useMutation({
    mutationFn: async ({
      id,
      service_id,
    }: {
      id: string;
      service_id: string | null;
    }) => {
      console.log('[AdminBundles] Linking service:', { id, service_id });
      const { error } = await supabase
        .from('bundle_items')
        .update({ service_id })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['all-bundles-with-items'] });
      toast({ title: 'Service linked successfully!' });
    },
    onError: (error: any) => {
      console.error('[AdminBundles] Service link failed:', error);
      toast({ title: 'Failed to link service', description: error?.message || 'Unknown error', variant: 'destructive' });
    },
  });

  // Update item ratio
  const updateItemRatioMutation = useMutation({
    mutationFn: async ({
      id,
      ratio_percent,
    }: {
      id: string;
      ratio_percent: number;
    }) => {
      const { error } = await supabase
        .from('bundle_items')
        .update({ ratio_percent })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
    },
  });

  // Toggle custom ratios mode
  const toggleCustomRatiosMutation = useMutation({
    mutationFn: async ({
      id,
      use_custom_ratios,
    }: {
      id: string;
      use_custom_ratios: boolean;
    }) => {
      const { error } = await supabase
        .from('engagement_bundles')
        .update({ use_custom_ratios })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
    },
  });

  // Toggle AI Organic Mode
  const toggleAiOrganicMutation = useMutation({
    mutationFn: async ({
      id,
      ai_organic_enabled,
    }: {
      id: string;
      ai_organic_enabled: boolean;
    }) => {
      const { error } = await supabase
        .from('engagement_bundles')
        .update({ ai_organic_enabled })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      toast({
        title: 'AI Organic Mode Updated',
        description: 'Each order will now get unique AI-generated organic patterns',
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredBundles =
    bundles?.filter((b) => b.platform === selectedPlatform) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 px-2 sm:px-4 lg:px-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            to="/admin"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Engagement Bundles
            </h1>
            <p className="text-sm text-muted-foreground">
              Create platform bundles with engagement types
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-2">
                <Plus className="h-4 w-4" />
                Create Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Create New Bundle
                </DialogTitle>
              </DialogHeader>
              <CreateBundleForm
                onSubmit={(data) => createBundleMutation.mutate(data)}
                isLoading={createBundleMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Platform Tabs */}
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList className="h-11 p-1 rounded-xl bg-muted/50">
            {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-lg capitalize data-[state=active]:bg-background"
              >
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedPlatform} className="mt-6 space-y-4">
            {filteredBundles.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No bundles yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first bundle for{' '}
                  {
                    PLATFORM_CONFIG[selectedPlatform as keyof typeof PLATFORM_CONFIG]
                      ?.label
                  }
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Bundle
                </Button>
              </Card>
            ) : (
              filteredBundles.map((bundle) => (
                <BundleCard
                  key={bundle.id}
                  bundle={bundle}
                  services={services || []}
                  mappedServices={allServices}
                  providerAccounts={providerAccounts || []}
                  onToggle={(active) =>
                    toggleBundleMutation.mutate({ id: bundle.id, is_active: active })
                  }
                  onToggleCustomRatios={(use_custom_ratios) =>
                    toggleCustomRatiosMutation.mutate({ id: bundle.id, use_custom_ratios })
                  }
                  onToggleAiOrganic={(ai_organic_enabled) =>
                    toggleAiOrganicMutation.mutate({ id: bundle.id, ai_organic_enabled })
                  }
                  onDelete={() => setDeleteBundle(bundle.id)}
                  onAddItem={(data) =>
                    addItemMutation.mutate({ ...data, bundle_id: bundle.id })
                  }
                  onDeleteItem={(id) => deleteItemMutation.mutate(id)}
                  onUpdateItem={(id, service_id) =>
                    updateItemMutation.mutate({ id, service_id })
                  }
                  onUpdateRatio={(id, ratio_percent) =>
                    updateItemRatioMutation.mutate({ id, ratio_percent })
                  }
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteBundle}
          onOpenChange={(open) => !open && setDeleteBundle(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Bundle
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this bundle? This will also delete
                all items within it. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteBundle && deleteBundleMutation.mutate(deleteBundle)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}

function CreateBundleForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: {
    name: string;
    platform: string;
    description?: string;
  }) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [description, setDescription] = useState('');

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Bundle Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Instagram Full Engagement"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bundle description..."
          className="h-11 rounded-xl"
        />
      </div>
      <DialogFooter className="pt-4">
        <Button
          onClick={() => onSubmit({ name, platform, description })}
          disabled={!name || isLoading}
          className="w-full rounded-xl"
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Create Bundle
        </Button>
      </DialogFooter>
    </div>
  );
}

function BundleCard({
  bundle,
  services,
  mappedServices,
  providerAccounts,
  onToggle,
  onToggleCustomRatios,
  onToggleAiOrganic,
  onDelete,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onUpdateRatio,
}: {
  bundle: any;
  services: any[];
  mappedServices: any[];
  providerAccounts: any[];
  onToggle: (active: boolean) => void;
  onToggleCustomRatios: (use_custom_ratios: boolean) => void;
  onToggleAiOrganic: (ai_organic_enabled: boolean) => void;
  onDelete: () => void;
  onAddItem: (data: {
    engagement_type: string;
    ratio_percent: number;
    is_base: boolean;
  }) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, service_id: string | null) => void;
  onUpdateRatio: (id: string, ratio_percent: number) => void;
}) {
  const [editingRatios, setEditingRatios] = useState<Record<string, string>>({});
  const existingTypes = new Set(
    bundle.items?.map((i: any) => i.engagement_type) || []
  );

  const handleQuickAdd = (type: EngagementType) => {
    const ratio = DEFAULT_RATIOS[type];
    const isBase = type === 'views';
    onAddItem({ engagement_type: type, ratio_percent: ratio, is_base: isBase });
  };

  const useCustomRatios = bundle.use_custom_ratios ?? false;
  const aiOrganicEnabled = bundle.ai_organic_enabled ?? true;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{bundle.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {bundle.description || 'No description'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <Switch
                checked={bundle.is_active}
                onCheckedChange={onToggle}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* AI Organic Mode Toggle - MAIN FEATURE */}
        <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${aiOrganicEnabled
          ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10 border-green-500/40'
          : 'bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-yellow-500/10 border-orange-500/40'
          }`}>
          <div className="flex items-center gap-3">
            {aiOrganicEnabled ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Brain className="h-6 w-6 text-white" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Sparkle className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-base">
                  {aiOrganicEnabled ? '🤖 AI Organic Mode' : '⚡ Manual Mode'}
                </p>
                <Badge
                  variant={aiOrganicEnabled ? 'default' : 'secondary'}
                  className={aiOrganicEnabled ? 'bg-green-500 text-white text-[10px]' : 'text-[10px]'}
                >
                  {aiOrganicEnabled ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {aiOrganicEnabled
                  ? 'AI generates UNIQUE organic patterns for each order automatically'
                  : 'Users configure their own organic settings per order'
                }
              </p>
              {aiOrganicEnabled && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                    ✓ Unique S-curve per order
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                    ✓ Random variance
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                    ✓ Anti-bot detection
                  </span>
                </div>
              )}
            </div>
          </div>
          <Switch
            checked={aiOrganicEnabled}
            onCheckedChange={onToggleAiOrganic}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        {/* Custom Ratios Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
          <div className="flex items-center gap-3">
            {useCustomRatios ? (
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Percent className="h-5 w-5 text-primary" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-accent" />
              </div>
            )}
            <div>
              <p className="font-medium text-sm">
                {useCustomRatios ? 'Custom Ratios' : 'AI Organic Ratios'}
              </p>
              <p className="text-xs text-muted-foreground">
                {useCustomRatios
                  ? 'Using your custom % for each type'
                  : 'AI automatically calculates organic engagement ratios'
                }
              </p>
            </div>
          </div>
          <Switch
            checked={useCustomRatios}
            onCheckedChange={onToggleCustomRatios}
          />
        </div>

        {/* Quick Add Chips - Platform Specific */}
        <div className="flex flex-wrap gap-2">
          {(PLATFORM_ENGAGEMENT_TYPES[bundle.platform] || []).map((type) => {
            const Icon = ENGAGEMENT_ICONS[type];
            const exists = existingTypes.has(type);
            const label = type === 'watch_hours' ? 'Watch Hours' : type;
            return (
              <Button
                key={type}
                variant={exists ? 'secondary' : 'outline'}
                size="sm"
                disabled={exists}
                onClick={() => handleQuickAdd(type)}
                className="capitalize rounded-lg gap-1"
              >
                {Icon && <Icon className="h-3 w-3" />}
                {label}
                {!exists && <Plus className="h-3 w-3" />}
              </Button>
            );
          })}
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {bundle.items?.map((item: any) => {
            const Icon =
              ENGAGEMENT_ICONS[item.engagement_type as keyof typeof ENGAGEMENT_ICONS] ||
              Eye;
            const isBase = item.is_base || item.engagement_type === 'views';
            const displayRatio = useCustomRatios
              ? item.ratio_percent
              : DEFAULT_RATIOS[item.engagement_type as EngagementType] || item.ratio_percent;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-muted/50 space-y-3"
              >
                {/* Top row - Type info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium capitalize">
                      {item.engagement_type}
                    </span>
                    {/* Only show % badge when custom ratios is ON */}
                    {useCustomRatios && (
                      <Badge
                        variant="secondary"
                        className={`text-xs font-bold ${isBase ? 'bg-primary/20 text-primary' : ''}`}
                      >
                        {displayRatio}%
                      </Badge>
                    )}
                    {isBase && (
                      <Badge className="bg-primary text-primary-foreground text-[10px]">
                        Base
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteItem(item.id)}
                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Ratio Input - Only show when custom ratios enabled and not base */}
                {useCustomRatios && !isBase && (
                  <div className="flex items-center gap-2 pl-12">
                    <span className="text-xs text-muted-foreground">Custom Ratio:</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={editingRatios[item.id] ?? item.ratio_percent}
                        onChange={(e) => {
                          setEditingRatios(prev => ({
                            ...prev,
                            [item.id]: e.target.value
                          }));
                        }}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= 100) {
                            onUpdateRatio(item.id, val);
                          }
                          setEditingRatios(prev => {
                            const next = { ...prev };
                            delete next[item.id];
                            return next;
                          });
                        }}
                        className="w-20 h-8 text-sm text-center px-2 rounded-lg font-bold text-primary border-primary/30"
                        min={0}
                        max={100}
                        step={0.1}
                      />
                      <span className="text-primary font-bold text-sm">%</span>
                    </div>
                  </div>
                )}

                {/* Service Link + Provider Config */}
                <div className="flex items-center gap-2 pl-12">
                  {(() => {
                    const selectedService = item.service_id
                      ? services.find(s => s.id === item.service_id)
                      : null;

                    // Smart filter: match services by platform + engagement type
                    const engType = item.engagement_type?.toLowerCase() || '';
                    const platName = bundle.platform?.toLowerCase() || '';
                    // Map engagement types to search keywords
                    const typeKeywords: Record<string, string[]> = {
                      views: ['view'],
                      likes: ['like'],
                      comments: ['comment'],
                      saves: ['save'],
                      shares: ['share'],
                      reposts: ['repost'],
                      followers: ['follow'],
                      watch_hours: ['watch', 'hour'],
                    };
                    const keywords = typeKeywords[engType] || [engType];

                    const filteredServices = mappedServices.filter(s => {
                      const name = s.name?.toLowerCase() || '';
                      const matchesPlatform = name.includes(platName);
                      const matchesType = keywords.some(kw => name.includes(kw));
                      return matchesPlatform && matchesType;
                    });

                    // Use filtered list if matches found, otherwise show all
                    const displayServices = filteredServices.length > 0 ? filteredServices : mappedServices;

                    return (
                      <div className="flex items-center gap-2 flex-1">
                        {displayServices.length > 0 ? (
                          <Select
                            value={item.service_id || ""}
                            onValueChange={(v) => onUpdateItem(item.id, v)}
                          >
                            <SelectTrigger className="flex-1 h-9 rounded-lg text-xs bg-background">
                              <SelectValue placeholder="Select a service...">
                                {item.service_id
                                  ? (selectedService?.name?.slice(0, 35) || 'Service') + ` ($${selectedService?.price || '?'})`
                                  : 'Select a service...'
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-popover border border-border shadow-xl z-50 max-h-60">
                              {displayServices.map((s) => (
                                <SelectItem key={s.id} value={s.id} className="text-xs">
                                  {s.name.slice(0, 45)} (${s.price})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex-1 h-9 px-3 rounded-lg bg-muted/50 flex items-center text-xs text-muted-foreground">
                            {item.service_id
                              ? (selectedService?.name?.slice(0, 30) || 'Service linked')
                              : '← Use Providers button to import & link →'
                            }
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Provider config - always show, linked badge only when service is linked */}
                  {item.service_id && (
                    <Badge className="bg-success/20 text-success text-[10px] gap-1 shrink-0">
                      <Link2 className="h-3 w-3" />
                      Linked
                    </Badge>
                  )}

                  <ProviderMappingDialog
                    serviceId={item.service_id}
                    bundleItemId={item.id}
                    serviceName={item.service_id ? (services.find(s => s.id === item.service_id)?.name || 'Service') : item.engagement_type}
                    providerAccounts={providerAccounts}
                    allServices={mappedServices}
                    engagementType={item.engagement_type}
                    platform={bundle.platform}
                    onServiceLinked={(id, sid) => onUpdateItem(id, sid)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {bundle.items?.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">Click engagement types above to add them</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Provider Mapping Dialog for bundle items
function ProviderMappingDialog({
  serviceId: initialServiceId,
  bundleItemId,
  serviceName,
  providerAccounts,
  allServices,
  engagementType,
  platform,
  onServiceLinked,
}: {
  serviceId: string | null | undefined;
  bundleItemId: string;
  serviceName: string;
  providerAccounts: any[];
  allServices?: any[];
  engagementType?: string;
  platform?: string;
  onServiceLinked?: (bundleItemId: string, serviceId: string) => void;
}) {
  const [serviceId, setServiceId] = useState(initialServiceId);

  // Sync with prop changes
  useEffect(() => {
    setServiceId(initialServiceId);
  }, [initialServiceId]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [mappings, setMappings] = useState<Record<string, { checked: boolean; serviceId: string; sortOrder: number }>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch existing mappings when dialog opens (only if serviceId exists)
  const { data: existingMappings, refetch } = useQuery({
    queryKey: ['service-mappings-bundle', serviceId],
    queryFn: async () => {
      if (!serviceId) return [];
      const { data, error } = await supabase
        .from('service_provider_mapping')
        .select('*')
        .eq('service_id', serviceId);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!serviceId,
    staleTime: 0, // Always refetch when dialog opens
    refetchOnMount: 'always',
  });

  // Force refetch when dialog opens
  useEffect(() => {
    if (isOpen && serviceId) {
      refetch();
    }
  }, [isOpen, serviceId]);

  // Count of configured accounts
  const configuredCount = existingMappings?.length || 0;

  // Auto-match: find the best provider_service_id PER PROVIDER ACCOUNT
  // Each provider account belongs to a different provider with different service IDs
  const autoMatchPerAccount = useMemo(() => {
    const result: Record<string, string> = {};
    if (!allServices?.length || !providerAccounts?.length) return result;

    const platName = (platform || '').toLowerCase();
    const engType = (engagementType || '').toLowerCase();
    const typeKeywords: Record<string, string[]> = {
      views: ['view'],
      likes: ['like'],
      comments: ['comment'],
      saves: ['save'],
      shares: ['share'],
      reposts: ['repost'],
      followers: ['follow'],
      watch_hours: ['watch', 'hour'],
    };
    const keywords = typeKeywords[engType] || [engType];

    // If a service is already linked, find its provider_service_id for the linked provider
    // and also find matching services for OTHER providers
    providerAccounts.forEach(account => {
      // Find services imported from THIS account's provider
      const providerServices = allServices.filter((s: any) => s.provider_id === account.provider_id);

      // Try to match by platform + engagement type keywords
      const match = providerServices.find((s: any) => {
        const name = (s.name || '').toLowerCase();
        return name.includes(platName) && keywords.some((kw: string) => name.includes(kw));
      });

      if (match?.provider_service_id) {
        result[account.id] = match.provider_service_id;
        console.log(`[ProviderMapping] Auto-match for ${account.name}: ${match.provider_service_id} (${match.name})`);
      } else {
        console.log(`[ProviderMapping] No match for ${account.name} (provider_id: ${account.provider_id}), tried ${providerServices.length} services`);
      }
    });

    return result;
  }, [allServices, providerAccounts, platform, engagementType]);

  // Initialize mappings when dialog opens and data loads
  const initMappings = () => {
    console.log('[ProviderMapping] initMappings:', { autoMatchPerAccount, providerAccountsCount: providerAccounts.length });
    const newMappings: Record<string, { checked: boolean; serviceId: string; sortOrder: number }> = {};
    providerAccounts.forEach(account => {
      const existing = existingMappings?.find(m => m.provider_account_id === account.id);
      newMappings[account.id] = {
        checked: !!existing,
        // Use existing mapping, OR per-provider auto-matched service ID
        serviceId: existing?.provider_service_id || autoMatchPerAccount[account.id] || '',
        sortOrder: existing?.sort_order || account.priority,
      };
    });
    setMappings(newMappings);
    setHasChanges(false);
  };

  // Proper initialization with useEffect when data loads
  useEffect(() => {
    if (isOpen && providerAccounts?.length && existingMappings !== undefined) {
      initMappings();
    }
  }, [isOpen, existingMappings, providerAccounts, autoMatchPerAccount]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      let currentServiceId = serviceId;

      // If no service linked yet, auto-import first using the first checked account's service ID
      if (!currentServiceId) {
        const firstChecked = Object.entries(mappings).find(([_, v]) => v.checked && v.serviceId.trim());
        if (!firstChecked) {
          toast({ title: 'Please enter a Service ID and check at least one account', variant: 'destructive' });
          return;
        }

        const [accountId, data] = firstChecked;
        const acct = providerAccounts.find(a => a.id === accountId);
        if (!acct) {
          toast({ title: 'Provider account not found', variant: 'destructive' });
          return;
        }

        console.log('[ProviderMapping] Auto-importing service:', {
          provider_id: acct.provider_id,
          service_id: data.serviceId.trim(),
          account_name: acct.name,
        });

        // Build category name for auto-import
        const categoryOverride = platform && engagementType
          ? `${platform.charAt(0).toUpperCase() + platform.slice(1)} ${engagementType.charAt(0).toUpperCase() + engagementType.slice(1)}`
          : undefined;

        // Auto-import the service
        const { data: importResult, error: importError } = await supabase.functions.invoke('import-services', {
          body: {
            provider_id: acct.provider_id,
            action: 'import',
            service_ids: [data.serviceId.trim()],
            category_override: categoryOverride,
          },
        });

        console.log('[ProviderMapping] Import result:', importResult, 'Error:', importError);

        // Check BOTH SDK error AND edge function response error
        if (importError) {
          console.error('Auto-import SDK error:', importError);
          toast({ title: 'Service import failed', description: importError.message, variant: 'destructive' });
          return;
        }

        if (importResult?.error) {
          console.error('Auto-import edge function error:', importResult.error);
          toast({ title: 'Service import failed', description: importResult.error, variant: 'destructive' });
          return;
        }

        if (!importResult?.success) {
          console.error('Auto-import unexpected response:', importResult);
          toast({ title: 'Service import failed', description: 'Unexpected response from import function', variant: 'destructive' });
          return;
        }

        console.log('[ProviderMapping] Import success, looking up service in DB...');

        // Find the newly imported service
        const { data: importedService, error: lookupError } = await supabase
          .from('services')
          .select('id')
          .eq('provider_id', acct.provider_id)
          .eq('provider_service_id', data.serviceId.trim())
          .single();

        console.log('[ProviderMapping] DB lookup result:', importedService, 'Error:', lookupError);

        if (!importedService) {
          toast({
            title: 'Service not found in database',
            description: `Imported OK but couldn't find service ${data.serviceId.trim()} for provider ${acct.provider_id}. Check provider_id matches.`,
            variant: 'destructive'
          });
          return;
        }

        currentServiceId = importedService.id;

        // Auto-link to bundle item
        if (onServiceLinked) {
          onServiceLinked(bundleItemId, currentServiceId);
        }
        setServiceId(currentServiceId);
        toast({ title: `Service #${data.serviceId.trim()} imported & linked!` });
      }

      // Get current mappings
      const { data: currentMappings } = await supabase
        .from('service_provider_mapping')
        .select('id, provider_account_id')
        .eq('service_id', currentServiceId);

      const currentAccountIds = new Set(currentMappings?.map(m => m.provider_account_id) || []);
      const newAccountIds = new Set(
        Object.entries(mappings)
          .filter(([_, val]) => val.checked)
          .map(([id]) => id)
      );

      // Batch delete removed mappings
      const toDelete = (currentMappings || []).filter(m => !newAccountIds.has(m.provider_account_id));
      if (toDelete.length > 0) {
        await supabase
          .from('service_provider_mapping')
          .delete()
          .in('id', toDelete.map(m => m.id));
      }

      // Batch upsert mappings - split into updates and inserts
      const toUpdate: { id: string; provider_service_id: string; sort_order: number }[] = [];
      const toInsert: { service_id: string; provider_account_id: string; provider_service_id: string; sort_order: number; is_active: boolean }[] = [];

      for (const [accountId, data] of Object.entries(mappings)) {
        if (!data.checked) continue;
        if (currentAccountIds.has(accountId)) {
          const existing = currentMappings?.find(m => m.provider_account_id === accountId);
          if (existing) {
            toUpdate.push({ id: existing.id, provider_service_id: data.serviceId, sort_order: data.sortOrder });
          }
        } else {
          toInsert.push({
            service_id: currentServiceId,
            provider_account_id: accountId,
            provider_service_id: data.serviceId,
            sort_order: data.sortOrder,
            is_active: true,
          });
        }
      }

      // Run updates and inserts in parallel
      if (toInsert.length > 0) {
        await supabase.from('service_provider_mapping').insert(toInsert);
      }
      await Promise.all(
        toUpdate.map(u =>
          supabase.from('service_provider_mapping')
            .update({ provider_service_id: u.provider_service_id, sort_order: u.sort_order, is_active: true })
            .eq('id', u.id)
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-mappings-bundle'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-preview'] });
      queryClient.invalidateQueries({ queryKey: ['mapped-service-ids'] });
      queryClient.invalidateQueries({ queryKey: ['admin-services-active'] });
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      refetch();
      toast({ title: 'Provider mappings saved!' });
      setHasChanges(false);
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleMappingChange = (accountId: string, field: string, value: any) => {
    setMappings(prev => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-lg gap-1.5 text-xs"
        >
          <Globe className="h-3.5 w-3.5" />
          Providers
          {configuredCount > 0 && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1">
              {configuredCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Provider Rotation
          </DialogTitle>
          <DialogDescription>
            Configure which provider accounts can fulfill "{serviceName.slice(0, 30)}..."
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!providerAccounts?.length ? (
            <div className="text-center text-muted-foreground py-6">
              <Globe className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No provider accounts available.</p>
              <p className="text-xs mt-1">Create accounts in Admin → Provider Accounts</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Use</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead className="w-20">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerAccounts.map(account => {
                  const mapping = mappings[account.id] || {
                    checked: false,
                    serviceId: '',
                    sortOrder: account.priority,
                  };

                  return (
                    <TableRow key={account.id}>
                      <TableCell>
                        <Checkbox
                          checked={mapping.checked}
                          onCheckedChange={(checked) =>
                            handleMappingChange(account.id, 'checked', checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{account.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {account.provider_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={mapping.serviceId}
                          onChange={(e) =>
                            handleMappingChange(account.id, 'serviceId', e.target.value)
                          }
                          placeholder="Service ID"
                          className="h-8 w-32 text-xs"
                          disabled={!mapping.checked}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={mapping.sortOrder}
                          onChange={(e) =>
                            handleMappingChange(account.id, 'sortOrder', parseInt(e.target.value) || 1)
                          }
                          className="h-8 w-14 text-xs"
                          disabled={!mapping.checked}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Info */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1">
            <p><strong>Priority Order:</strong> Lower number = checked first (1 = highest priority)</p>
            <p>If account #1 has active order on same link, system tries #2, then #3, and so on.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!hasChanges || saveMutation.isPending}
          >
            {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Mappings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component to show linked providers on hover
function ServiceProviderPreview({
  serviceId,
  serviceName,
  providerAccounts,
}: {
  serviceId: string;
  serviceName: string;
  providerAccounts: any[];
}) {
  // Fetch mappings for this service
  const { data: mappings } = useQuery({
    queryKey: ['service-provider-preview', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_mapping')
        .select('*')
        .eq('service_id', serviceId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const mappedProviders = mappings?.map(m => {
    const account = providerAccounts.find(a => a.id === m.provider_account_id);
    return {
      name: account?.name || 'Unknown',
      providerId: account?.provider_id || '',
      serviceId: m.provider_service_id,
      order: m.sort_order,
    };
  }) || [];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex-1 h-9 px-3 rounded-lg bg-background flex items-center text-xs text-muted-foreground truncate cursor-pointer hover:bg-muted transition-colors">
          {serviceName}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3 bg-popover" align="start">
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Linked Providers:</p>
          {mappedProviders.length > 0 ? (
            <div className="space-y-1.5">
              {mappedProviders.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-muted p-2 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground">{p.providerId}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    ID: {p.serviceId}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No providers configured</p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
