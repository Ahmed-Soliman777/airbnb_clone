import { fetchAmenities } from "@/store/Slices/amenitySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";

const Amenity = () => {
  const dispatch = useDispatch();
  const { amenities, status, error } = useSelector((state) => state.amenity);

  // Fetch amenities on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAmenities());
    }
  }, [status, dispatch]);

  // Function to render SVG icon with dynamic class names
  function AmenityIcon({ svgString, className }) {
    const SVG = svgString.replace(
      /className="([^"]*)"/,
      `className="${className}"`
    );
    return <>{parse(SVG)}</>;
  }

  if (status === "loading") return <div className="p-4 ">Loading...</div>;
  if (error) return <div className="p-4">Error loading amenities</div>;

  return (
    <div className="flex flex-wrap gap-4">
      {amenities?.map((amenity) => (
        <div key={amenity._id} className="flex items-center gap-2">
          <AmenityIcon
            svgString={amenity.icon}
            className="w-6 h-6 text-gray-600"
          />
          <span>{amenity.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Amenity;
