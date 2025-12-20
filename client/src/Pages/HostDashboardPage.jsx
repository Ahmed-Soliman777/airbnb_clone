import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Briefcase, Compass, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Import Redux actions
import { getHostListings, deleteListing } from "@/store/Slices/listingSlice";
import { getHostServices, deleteService } from "@/store/Slices/serviceSlice";
import { getHostExperiences, deleteExperience } from "@/store/Slices/experienceSlice";

const HostDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("homes");

  const { hostListings, status: homesStatus } = useSelector((state) => state.listing || {});
  const { hostServices, status: servicesStatus } = useSelector((state) => state.service || {});
  const { hostExperiences, status: experiencesStatus } = useSelector((state) => state.experience || {});

  useEffect(() => {
    dispatch(getHostListings());
    dispatch(getHostServices());
    dispatch(getHostExperiences());
  }, [dispatch]);

  const handleDeleteHome = async (id) => {
    try {
      await dispatch(deleteListing(id)).unwrap();
      toast.success("Home listing deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete home listing");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await dispatch(deleteService(id)).unwrap();
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete service");
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await dispatch(deleteExperience(id)).unwrap();
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete experience");
    }
  };

  const renderListingCard = (listing, type) => {
    // Helper to get image URL safely
    const getImageUrl = (item) => {
      if (!item.images || item.images.length === 0) return null;
      const firstImage = item.images[0];
      return typeof firstImage === 'string' ? firstImage : firstImage.url;
    };

    // Helper to get location string
    const getLocation = (item) => {
      if (item.city) return item.city; // Flat structure
      if (item.address?.city) return item.address.city; // Listing structure
      if (item.location?.city) return item.location.city; // Service/Experience structure
      return "Location info unavailable";
    };

    // Helper to get price
    const getPrice = (item) => {
      if (item.price) return item.price;
      if (item.pricePerNight) return item.pricePerNight;
      if (item.hourlyRate) return item.hourlyRate;
      if (item.pricePerPerson) return item.pricePerPerson;
      return "0";
    };

    const imageUrl = getImageUrl(listing);
    const location = getLocation(listing);
    const price = getPrice(listing);

    return (
      <Card key={listing._id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {type === "home" && <Home className="w-12 h-12 text-muted-foreground" />}
              {type === "service" && <Briefcase className="w-12 h-12 text-muted-foreground" />}
              {type === "experience" && <Compass className="w-12 h-12 text-muted-foreground" />}
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {location} • ${price}/
            {type === "home" ? "night" : type === "service" ? "hour" : "person"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => navigate(`/host/${type}s/edit/${listing._id}`)}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {type}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your {type} listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (type === "home") handleDeleteHome(listing._id);
                      if (type === "service") handleDeleteService(listing._id);
                      if (type === "experience") handleDeleteExperience(listing._id);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = (type) => (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        {type === "home" && <Home className="w-10 h-10 text-muted-foreground" />}
        {type === "service" && <Briefcase className="w-10 h-10 text-muted-foreground" />}
        {type === "experience" && <Compass className="w-10 h-10 text-muted-foreground" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">No {type}s yet</h3>
      <p className="text-muted-foreground mb-6">
        Create your first {type} listing to start hosting
      </p>
      <Link to="/host">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create {type} listing
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </Link>
              <h1 className="text-2xl font-bold">My Listings</h1>
            </div>
            <Link to="/host">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Listing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="homes" className="gap-2">
              <Home className="w-4 h-4" />
              Homes ({hostListings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Services ({hostServices?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="experiences" className="gap-2">
              <Compass className="w-4 h-4" />
              Experiences ({hostExperiences?.length || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="homes" className="mt-6">
            {homesStatus === "loading" && renderSkeletons()}
            {homesStatus === "failed" && <div className="text-red-500 text-center py-8">Failed to load homes. Please try again.</div>}
            {homesStatus === "succeeded" && (!hostListings || hostListings.length === 0) && renderEmptyState("home")}
            {homesStatus === "succeeded" && hostListings && hostListings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostListings.map(listing => renderListingCard(listing, "home"))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            {servicesStatus === "loading" && renderSkeletons()}
            {servicesStatus === "failed" && <div className="text-red-500 text-center py-8">Failed to load services. Please try again.</div>}
            {servicesStatus === "succeeded" && (!hostServices || hostServices.length === 0) && renderEmptyState("service")}
            {servicesStatus === "succeeded" && hostServices && hostServices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostServices.map(service => renderListingCard(service, "service"))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="experiences" className="mt-6">
            {experiencesStatus === "loading" && renderSkeletons()}
            {experiencesStatus === "failed" && <div className="text-red-500 text-center py-8">Failed to load experiences. Please try again.</div>}
            {experiencesStatus === "succeeded" && (!hostExperiences || hostExperiences.length === 0) && renderEmptyState("experience")}
            {experiencesStatus === "succeeded" && hostExperiences && hostExperiences.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostExperiences.map(experience => renderListingCard(experience, "experience"))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HostDashboardPage;
