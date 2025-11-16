import { fetchAmenities } from "@/store/Slices/amenitySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";

const Amenity = ({ amenities: listingAmenities = [] }) => {
  const dispatch = useDispatch();
  const { amenities: allAmenities, status } = useSelector(
    (state) => state.amenity
  );

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

  // Match listing amenities with full amenity data (including icons)
  const displayAmenities = listingAmenities
    .map((listingAmenity) => {
      const amenityId = listingAmenity?._id || listingAmenity;
      return allAmenities.find((a) => a._id === amenityId);
    })
    .filter(Boolean);

  return (
    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
      {displayAmenities.length > 0 ? (
        displayAmenities.map((amenity) => (
          <div key={amenity._id} className="flex items-center gap-3 ">
            <AmenityIcon
              svgString={amenity.icon}
              className="w-5 h-5 text-gray-700"
            />
            <span className="text-gray-800 text-sm ">{amenity.name}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No amenities listed here.</p>
      )}
    </div>
  );
};

export default Amenity;
