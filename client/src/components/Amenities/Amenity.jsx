import {
  Camera,
  Coffee,
  Droplet,
  FolderPlus,
  Image as ImageIcon,
  Sun,
  Truck,
  WashingMachine,
  Wifi,
} from "lucide-react";

export const amenities = [
  { id: "garden", label: "Garden view", icon: Sun },
  { id: "mountain", label: "Mountain view", icon: ImageIcon },
  { id: "kitchen", label: "Kitchen", icon: FolderPlus },
  { id: "wifi", label: "Wifi", icon: Wifi },
  { id: "parking", label: "Free parking on premises – 2 spaces", icon: Truck },
  { id: "washer", label: "Free washer – In building", icon: WashingMachine },
  { id: "dryer", label: "Free dryer – In building", icon: Droplet },
  {
    id: "private_garden",
    label: "Private back garden – Fully fenced",
    icon: Sun,
  },
  { id: "luggage", label: "Luggage drop-off allowed", icon: Truck },
  {
    id: "security",
    label: "Exterior security cameras on property",
    icon: Camera,
  },
  { id: "coffee", label: "Free tea and coffee", icon: Coffee },
];

const Amenity = ({ icon: Icon, label }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">
        <Icon size={18} />
      </div>
      <div className="text-sm">
        <div className="font-medium text-gray-800">{label}</div>
      </div>
    </div>
  );
};

export default Amenity;
