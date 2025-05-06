import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/trip-details";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import { Header, InfoPill, TripCard } from "../../../components";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) throw new Error("Trip ID is required");

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    allTrips: trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })),
  };
};

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
  const imageUrls = loaderData.trip?.imageUrls || [];
  const allTrips = loaderData?.allTrips as Trip[] | [];

  const tripData = parseTripData(loaderData.trip?.tripDetail);
  const {
    name,
    description,
    estimatedPrice,
    duration,
    budget,
    travelStyle,
    country,
    interests,
    groupType,
    bestTimeToVisit,
    weatherInfo,
    itinerary,
  } = tripData || {};

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-400" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit:", items: bestTimeToVisit },
    { title: "Weather Info:", items: weatherInfo },
  ];

  if (!tripData) {
    return (
      <main className="travel-detail wrapper">
        <Header
          title="Trip Details"
          description="View and edit AI-generated travel plans"
        />
        <div className="container wrapper-md ">
          <p className="text-center p-28-semibold text-dark-100">
            We couldn't find a trip with this ID.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
      />

      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
              classNames="text-nowrap mr-2"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 5)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
              classNames="truncate"
            />
          </div>
        </header>

        <section className="gallery">
          {imageUrls.map((imageUrl: string, index: number) => (
            <img
              src={imageUrl}
              alt="image from planned trip"
              key={index}
              className={cn(
                "w-full rounded-xl object-cover hover:scale-[102%] transition-transform duration-300",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]",
              )}
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center justify-between flex-wrap">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((pill, index) => (
                <ChipDirective
                  key={index}
                  text={getFirstWord(pill.text)}
                  cssClass={cn("!text-sm !px-4", pill.bg)}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
          <ul className="flex items-center gap-1">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-[16px]"
                  />
                </li>
              ))}
            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.6 / 5"
                    cssClass="!bg-yellow-100 !text-gray-500"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>

        <section className="title">
          <article>
            <h3>
              {duration}-day {country} {travelStyle} Trip
            </h3>
            <p>
              {budget} {groupType} and {interests}
            </p>
          </article>
          <h2>{estimatedPrice}</h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>

        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <h3>
                Day-{dayPlan.day}: {dayPlan.location}
              </h3>

              <ul>
                {dayPlan.activities.map((activity: Activity, index: number) => (
                  <li key={index}>
                    <span className="flex-shrink-0 p-18-semibold md:pt-1">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <h3>{section.title}</h3>
              <ul>
                {section.items?.map((item) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
      <section className="flex flex-col gap-6 mt-12">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <div className="trip-grid">
          {allTrips.map(
            ({
              id,
              name,
              imageUrls,
              interests,
              travelStyle,
              estimatedPrice,
            }) => (
              <TripCard
                key={id}
                id={id}
                name={name}
                location={itinerary?.[0].location ?? ""}
                imageUrl={imageUrls[0]}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            ),
          )}
        </div>
      </section>
    </main>
  );
};

export default TripDetails;
