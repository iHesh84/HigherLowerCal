/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Food = {
  id: number;
  name: string;
  imageUrl: string;
  calories: number;
};

export default function Home() {
  const [foodOne, setFoodOne] = useState<Food | null>(null);
  const [foodTwo, setFoodTwo] = useState<Food | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [loss, setLoss] = useState<boolean>(false);

  const fetchData = async (
    setFood: React.Dispatch<React.SetStateAction<Food | null>>
  ) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`
      );
      const nutritionValues = await axios.get(
        `https://api.spoonacular.com/recipes/${response.data.recipes[0].id}/nutritionWidget.json?apiKey=${apiKey}`
      );
      setFood({
        id: response.data.recipes[0].id,
        name: response.data.recipes[0].title,
        imageUrl: response.data.recipes[0].image,
        calories: nutritionValues.data.calories,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData(setFoodOne);
    fetchData(setFoodTwo);
  }, []);

  const handleWin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFoodOne(foodTwo);
      fetchData(setFoodTwo);
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore > highScore) setHighScore(newScore);
        return newScore;
      });
    }, 1250);
  };

  const handleLoss = () => {
    setLoss(true);
  };
  const handleRestart = () => {
    setScore(0);
    setLoss(false);
    fetchData(setFoodOne);
    fetchData(setFoodTwo);
  };

  function handleClick(higher: boolean) {
    const calFoodOne = foodOne?.calories;
    const calFoodTwo = foodTwo?.calories;
    if (!calFoodOne || !calFoodTwo) return;

    if (higher) {
      if (calFoodTwo >= calFoodOne) {
        handleWin();
      } else {
        handleLoss();
      }
    } else if (!higher) {
      if (calFoodTwo <= calFoodOne) {
        handleWin();
      } else {
        handleLoss();
      }
    }
  }

  return (
    <main className="bg-[#210C1B] min-h-screen flex items-center justify-center">
      {loss && (
        <section className="text-center absolute bg-[#362432] w-[30vw] aspect-square flex flex-col items-center justify-center gap-10 rounded-xl opacity-[.98]">
          <div>
            <p className="text-xl ">Score: {score}</p>
            <p className="text-xl ">High Score: {highScore}</p>
          </div>
          <Button className="px-10 py-6 " onClick={handleRestart}>
            Try again
          </Button>
        </section>
      )}
      <section className="flex flex-col  ">
        <h1 className="text-white font-extrabold text-center mb-10 text-3xl">
          CAL HIGHER LOWER
        </h1>

        <div className="flex justify-between gap-5 ">
          <div className="bg-[#2B1827] w-[450px] h-[700px] p-5 rounded-2xl">
            <div className="bg-[#362432] h-[60%] rounded-lg flex flex-col  items-center justify-center gap-10">
              {foodOne ? (
                <img
                  src={foodOne.imageUrl}
                  alt="Food Image"
                  className="h-[14rem] w-[14rem] rounded-md"
                />
              ) : (
                <Skeleton className="h-[14rem] w-[14rem] rounded-md" />
              )}

              <h1 className="text-center text-xl">
                {foodOne ? (
                  foodOne.name
                ) : (
                  <Skeleton className="h-[1.25rem] w-[17rem] rounded-md" />
                )}
              </h1>
            </div>
            <div className="flex flex-col items-center mt-[10rem]">
              {foodOne ? (
                <p className="font-extrabold text-3xl">
                  {foodOne.calories} CAL
                </p>
              ) : (
                <Skeleton className="h-[1.25rem] w-[17rem] rounded-md" />
              )}
            </div>
          </div>
          <div className="bg-[#2B1827] w-[450px] h-[700px] p-5 rounded-2xl">
            <div className="bg-[#362432] h-[60%] rounded-lg flex flex-col  items-center justify-center gap-10">
              {foodTwo ? (
                <img
                  src={foodTwo.imageUrl}
                  alt="Food Image"
                  className="h-[14rem] w-[14rem] rounded-md"
                />
              ) : (
                <Skeleton className="h-[14rem] w-[14rem] rounded-md" />
              )}
              <h1 className="text-center text-xl">
                {foodTwo ? (
                  foodTwo.name
                ) : (
                  <Skeleton className="h-[1.25rem] w-[17rem] rounded-md" />
                )}
              </h1>
            </div>
            <div className={`flex justify-center gap-10 text-center mt-36`}>
              {isLoading ? (
                <div className="border border-green-600 rounded-full py-5 px-16 font-bold text-3xl ">
                  {foodTwo?.calories} CAL
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleClick(false)}
                    className="border border-red-600 rounded-full h-24 w-24 font-bold text-red-600 hover:opacity-50"
                  >
                    LOWER
                  </button>
                  <button
                    onClick={() => handleClick(true)}
                    className="border border-green-600 rounded-full h-24 w-24 font-bold text-green-600 hover:opacity-50"
                  >
                    HIGHER
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-5">
            <p className="bg-[#362431]  py-1 px-3 rounded-full text-center">
              {score}
            </p>
            <p className="text-sm">SCORE</p>
          </div>

          <div className="flex items-center gap-5">
            <p className="text-sm">HIGH SCORE</p>
            <p className="bg-[#362431]  py-1 px-3 rounded-full text-center">
              {highScore}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
