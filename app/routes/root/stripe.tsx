import { Link, type LoaderFunctionArgs } from "react-router";
import { getTripById } from "~/appwrite/trips";
import { cn, formatKey, parseTripData } from "~/lib/utils";
import type { Route } from "./+types/stripe";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { comboBoxItems, selectItems } from "~/constants";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React, { type ChangeEvent, useState } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) throw new Error("Trip ID is required");

  const trip = await getTripById(tripId);
  return { trip };
};

const Stripe = ({ loaderData }: Route.ComponentProps) => {
  const { trip } = loaderData;
  const imageUrls = loaderData.trip?.imageUrls || [];
  const tripData = parseTripData(trip?.tripDetail);
  const { name, duration, country, travelStyle, interests, estimatedPrice } =
    tripData || {};

  const [loading, setLoading] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    email: "",
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("cardInfo: ", cardInfo);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <section className="bg-light-200 py-8 lg:mt-10 basis-1/2">
        <div className="flex flex-col h-full max-w-xl mx-auto px-4">
          <header className="root-nav">
            <Link to="/">
              <img
                src="/assets/icons/arrow-left.svg"
                alt="arrow-left"
                className="size-6 opacity-40"
              />
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
              <h1>Tourvisto</h1>
            </Link>
          </header>

          <div className="flex flex-col justify-between h-3/4 max-w-lg">
            <div className=" flex flex-col gap-3 wrapper-md">
              <h2 className="text-lg md:text-xl text-dark-400">
                Pay {duration}-day {name} Trip
              </h2>
              <p className="p-40-semibold mb-6">{estimatedPrice}.00</p>

              <img
                src={imageUrls[0]}
                alt={name}
                className="max-w-[300px] max-h-[200px] object-fill rounded-xl mb-6"
              />

              <p className="text-xl md:text-2xl text-dark-400 font-semibold">
                {duration}-day {country} {travelStyle}
              </p>
              <p className="text-base text-gray-100">
                {travelStyle}, {interests}
              </p>
            </div>
          </div>

          <footer className="flex text-gray-100 justify-items-end justify-between text-xs px-4 lg:px-8 py-12 w-2/3">
            <a
              href="https://stripe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className=" flex items-center gap-1.5"
            >
              Powered by
              <span>
                <img src="/assets/icons/stripe-logo.svg" alt="stripe" />
              </span>
            </a>
            <span>|</span>
            <Link to="/">Terms</Link>
            <Link to="/">Privacy</Link>
          </footer>
        </div>
      </section>

      <section className="bg-white shadow-[0_0_55px_rgba(0,0,0,0.1)] basis-1/2 h-screen">
        <div className="lg:mt-28 my-20 px-8 mx-auto max-w-xl">
          <button className="button-class-secondary-black !h-14 w-full">
            <img src="/assets/icons/apple-pay.svg" alt="Apple Pay" />
          </button>

          <div className="flex flex-row items-center text-gray-100 w-full mt-6">
            <hr className="w-full text-slate-300" />
            <p className="min-w-fit block px-2">Or pay with card</p>
            <hr className="w-full text-slate-300" />
          </div>

          <form className="pay-form" onSubmit={handleSubmit}>
            <div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={cardInfo.email}
                  className="pay-form-input placeholder:text-gray-100"
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-6">
                <label htmlFor="number">Credit Card</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="number"
                    value={cardInfo.number}
                    className="pay-form-input !border-b-0 !rounded-b-none placeholder:text-slate-400 w-full"
                    onChange={handleInputChange}
                    placeholder="1234 1223 1234 1234"
                  />
                  <img
                    src="/assets/icons/cards.svg"
                    alt="Credit card types"
                    className="absolute right-3 top-3.5 h-6 w-auto pointer-events-none"
                  />
                </div>
                <div className="flex flex-row">
                  <input
                    type="text"
                    name="expiry"
                    value={cardInfo.expiry}
                    className="pay-form-input !rounded-t-none !rounded-r-none placeholder:text-slate-400 -mt-3 w-full"
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                  />
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="cvc"
                      value={cardInfo.cvc}
                      className="pay-form-input !rounded-t-none !border-l-0 !rounded-l-none placeholder:text-slate-400 -ml-5 -mt-3 w-[264px] pl-2"
                      onChange={handleInputChange}
                      placeholder="  CVC"
                    />
                    <img
                      src="/assets/icons/card-cvc.svg"
                      alt="Credit card types"
                      className="absolute right-3 top-0.5 h-6 w-auto pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="name">Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  value={cardInfo.name}
                  className="pay-form-input"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <ButtonComponent
              type="submit"
              className={cn(
                "!text-white !h-14 !w-full !rounded-lg mt-6",
                !loading && "!bg-[#3C4257]",
              )}
              disabled={loading}
            >
              <span
                className={cn(
                  "text-xl",
                  !loading && "text-[#8792A2] !cursor-not-allowed",
                )}
              >
                {loading ? "Making payment..." : `Pay ${estimatedPrice}.00`}
              </span>
            </ButtonComponent>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Stripe;
