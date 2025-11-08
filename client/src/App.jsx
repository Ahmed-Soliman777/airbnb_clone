import "./App.css";
import BookingExperiences from "./components/Booking/BookingExperiences";
import Listing from "./components/Listing/Listing";

/* here we import the Button component from the ui folder 
after installing from shadcn => npx shadcn@latest add button*/
/* هنا بنستورد مكون الزرار من فولدر ui 
بعد ما نزلنا من shadcn عن طريق الامر => npx shadcn@latest add button */
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        {/* // we use Button component from shadcn after importing it here
          <Button>Shadcn Button</Button>
          // for testing the booking experiences component
          <BookingExperiences /> */}

        <Listing />
      </div>
    </>
  );
}

export default App;
