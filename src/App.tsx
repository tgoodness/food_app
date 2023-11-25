/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
interface INutrient {
  name: string;
  amount: number;
  amountRounded: number;
  unit: string;
}

interface IRdi {
  amount: number;
  unit: string;
  percentDailyValue: number;
  percentDailyValueRounded: number;
}

interface IChildren {
  nutrient: INutrient;
  rdi: IRdi;
}

interface Props {
  nutrient: INutrient;
  rdi?: IRdi;
  children?: IChildren[];
}

function App() {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const fetchJson = () => {
    setLoading(true);
    fetch("./data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data.data);
        setLoading(false);
        setSuccess(true);
      })
      .catch((e: Error) => {
        console.log(e.message);
        setLoading(false);
        setSuccess(false);
      });
  };

  useEffect(() => {
    fetchJson();
  }, []);

  if (isLoading) {
    return <h4>Loading...</h4>;
  }

  if (isSuccess) {
    return (
      <div className="flex justify-center items-center p-3 ">
        <div className="max-w-sm border-2 border-black px-4 pt-1 pb-3">
          <h1 className="text-5xl font-bold underline decoration-1 underline-offset-8">
            Nutrition Facts
          </h1>

          <div>
            <h5 className="text-lg">4 servings per container</h5>
            <div className="flex justify-between border-b-[13px] border-black pb-1">
              <p className="font-bold text-xl">Serving size</p>
              <p className="font-bold text-lg">1 cup (140g)</p>
            </div>

            {data.nutritionFacts.map((item: Props, idx: number) => {
              // disply calories only
              if (item.nutrient.name.toLowerCase() === "calories") {
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center border-b-8 border-black">
                      <div>
                        <h5 className="font-bold text-l">Amount per serving</h5>
                        <p className="font-bold text-3xl">
                          {item.nutrient.name}
                        </p>
                      </div>
                      <p className="font-semibold text-5xl">
                        {item.nutrient.amountRounded}
                      </p>
                    </div>

                    <div className="border-b-2 border-black">
                      <h6 className="text-l text-right">
                        % <strong>Daily Value*</strong>
                      </h6>
                    </div>
                  </div>
                );
              }

              //  has rdi and children
              if (item?.children) {
                return (
                  <div key={idx}>
                    <div className="flex justify-between border-b border-black">
                      <p>
                        <strong>{item.nutrient.name}</strong>{" "}
                        {item.nutrient.amountRounded}
                        {item.nutrient.unit}
                      </p>
                      <p>
                        <strong>{item.rdi!.percentDailyValueRounded}</strong>%
                      </p>
                    </div>

                    {item.children.map((cItem: any, cIdx: number) => (
                      <div
                        className="flex justify-between border-b border-black"
                        key={cIdx}
                      >
                        <p className={`ml-5 ${cItem?.rdi ? "" : "italic"}`}>
                          {cItem.nutrient.name} {cItem.nutrient.amountRounded}
                          {cItem.nutrient.unit}
                        </p>
                        {cItem.rdi && (
                          <p>
                            <strong>
                              {cItem.rdi.percentDailyValueRounded}
                            </strong>
                            %
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              // has rdi only
              if (item?.rdi) {
                return (
                  <div key={idx}>
                    <div
                      className={`flex justify-between ${
                        item.nutrient.name.toLowerCase() === "protein"
                          ? "border-b-[13px]"
                          : "border-b"
                      } border-black`}
                    >
                      <p>
                        <strong>{item.nutrient.name}</strong> 8g
                      </p>
                      <p>
                        <strong>{item.nutrient.amountRounded}</strong>%
                      </p>
                    </div>
                  </div>
                );
              }

              //  neither rdi nor children
              return (
                <div
                  className={`${
                    item.nutrient.name.toLowerCase() === "protein"
                      ? "border-b-[13px]"
                      : "border-b"
                  } border-black`}
                  key={idx}
                >
                  <p>
                    {item.nutrient.name} {item.nutrient.amountRounded}
                    {item.nutrient.unit}
                  </p>
                </div>
              );
            })}

            <h6 className="text-sm leading-4 mt-3">
              *The % Daily Value tells you how much a nutrient in a serving of
              food contributes to a daily diet. 2000 calories a day is used for
              general nutrition advice.
            </h6>
            {/* // */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
