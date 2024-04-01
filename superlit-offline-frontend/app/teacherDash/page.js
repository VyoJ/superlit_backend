import './style.css';
import Link from 'next/link';
export default function tdashboard(){
    var dashboardOptions = ["Assignments", "Classroom"];
    const currentHour = new Date().getHours();
    var greeting;
    if (currentHour < 12) {
      greeting = "Good Morning";
    } else if (currentHour < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
  
    return(
        <div>
            <div className="text-4xl flex justify-center items-center m-12 lg:mb-24 ">Hello! {greeting}</div>
            <div className="wrapper"></div>
        <div className=" grid lg:grid-cols-2 md:grid-cols-2 gap-12 mt-12">
          {dashboardOptions.map((dashboardItem, index) => (
            <div key={index}>
              <div className="card h-96 w-96">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="flex justify-center items-center text-2xl">{dashboardItem}</div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
            </div>
          ))}
        </div>
<div className="circle one"></div>
<div className="circle two"></div>
<svg>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.6' 
      stitchTiles='stitch'/>
  </filter>
</svg>
        </div>
    )
}
