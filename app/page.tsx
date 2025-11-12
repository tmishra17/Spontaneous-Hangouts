"use client";
import SpontaneousHangouts from "./SpontaneousHangouts";
import { useState } from "react";
// import Login from "./Login"
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div>
      
      {isLoggedIn? 
        (
          <Login setIsLoggedIn={setIsLoggedIn}/>
        ):
        (
          <SpontaneousHangouts setIsLoggedIn={setIsLoggedIn} />
        )
      }
    </div>
  );
}
