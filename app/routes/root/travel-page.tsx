import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Header, ImageGrid, TripCard } from "../../../components";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/travel-page";
import {
  Link,
  type LoaderFunctionArgs,
  NavLink,
  useSearchParams,
} from "react-router";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const { allTrips, total } = await getAllTrips(limit, offset);

  return {
    trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })),
    total,
  };
};

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData.trips as Trip[] | [];
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  return (
    <>
      <div className="travel-hero">
        <div className="h-screen">
          <section className="wrapper">
            <article>
              <h1 className="text-5xl md:text-8xl font-semibold">
                <span className="block">Plan Your</span>
                <span className="block">Trip with Ease</span>
              </h1>
              <p>
                Customize your travel itinerary in minutes—pick your
                destination, set your preferences, and explore with confidence.
              </p>
            </article>
            <ButtonComponent
              type="button"
              className="button-class !h-14 !px-14"
            >
              <span className="p-18-semibold text-white">Get Started</span>
            </ButtonComponent>
          </section>
        </div>
      </div>
      <div className="h-screen -mt-12" />

      <section className="travel-featured wrapper">
        <Header
          as="h2"
          title="Featured Travel Destinations"
          description="Check out some of the best places you can visit around the world."
        />

        <ImageGrid />
      </section>

      <section className="wrapper flex flex-col gap-[30px] mt-12">
        <Header
          as="h2"
          title="Handpicked Trips"
          description="Browse well-planned trips designed for different travel styles and interests."
        />

        <div className="trip-grid mb-4">
          {trips.map(
            ({
              id,
              name,
              imageUrls,
              interests,
              travelStyle,
              estimatedPrice,
              itinerary,
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

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>

      <footer className="footer-container wrapper">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1 className="text-base md:text-2xl font-bold text-dark-100">
            Tourvisto
          </h1>
        </Link>
        <div>
          <NavLink to="/">Terms & Condition</NavLink>
          <NavLink to="/">Privacy Policy</NavLink>
        </div>
      </footer>
    </>
  );
};

export default TravelPage;
