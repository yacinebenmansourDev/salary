import React, { useState } from "react";

function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getWorkedMinutes(start: string, end: string): number {
  return parseTime(end) - parseTime(start);
}

type WorkDay = {
  start: string;
  end: string;
  worked: boolean;
};

const App = () => {
  const [salary, setSalary] = useState("");
  const [days, setDays] = useState("");
  const [requiredHours, setRequiredHours] = useState("8");
  const [workData, setWorkData] = useState<WorkDay[]>([]);

  const handleDayChange = (
    index: number,
    field: keyof WorkDay,
    value: string | boolean
  ) => {
    const newData = [...workData];
    newData[index] = { ...newData[index], [field]: value };
    setWorkData(newData);
  };

  const resetAll = () => {
    setSalary("");
    setDays("");
    setRequiredHours("8");
    setWorkData([]);
  };

  const calculate = () => {
    const salaryNumber = parseFloat(salary);
    const daysNumber = parseInt(days);
    const requiredHoursNumber = parseFloat(requiredHours);

    if (
      isNaN(salaryNumber) ||
      isNaN(daysNumber) ||
      isNaN(requiredHoursNumber) ||
      salaryNumber <= 0 ||
      daysNumber <= 0 ||
      requiredHoursNumber <= 0
    ) {
      return {
        penalty: 0,
        bonus: 0,
        adjustedSalary: 0,
        totalMissingMinutes: 0,
        totalOvertimeMinutes: 0,
        workedDays: 0,
      };
    }

    const requiredMinutes = requiredHoursNumber * 60;
    const salaryPerMinute = salaryNumber / (daysNumber * requiredMinutes);

    let totalMissingMinutes = 0;
    let totalOvertimeMinutes = 0;
    let workedDays = 0;

    workData.forEach(({ worked, start, end }) => {
      if (!worked) {
        totalMissingMinutes += requiredMinutes;
      } else {
        workedDays++;
        const minutesWorked = getWorkedMinutes(start, end);
        if (minutesWorked < requiredMinutes) {
          totalMissingMinutes += requiredMinutes - minutesWorked;
        } else if (minutesWorked > requiredMinutes) {
          totalOvertimeMinutes += minutesWorked - requiredMinutes;
        }
      }
    });

    const penalty = totalMissingMinutes * salaryPerMinute;
    const bonus = totalOvertimeMinutes * salaryPerMinute;
    const adjustedSalary = salaryNumber - penalty + bonus;

    return {
      penalty,
      bonus,
      adjustedSalary,
      totalMissingMinutes,
      totalOvertimeMinutes,
      workedDays,
    };
  };

  const results = calculate();

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Outil d'ajustement des salaires
      </h1>

      <label>Salaire mensuel (DA)</label>
      <input
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        className="border p-1 rounded w-full mb-2"
      />

      <label>Nombre total de jours ouvrables</label>
      <input
        type="number"
        value={days}
        onChange={(e) => {
          const d = +e.target.value;
          setDays(e.target.value);
          if (!isNaN(d) && d > 0) {
            setWorkData(
              Array(d)
                .fill(null)
                .map(() => ({ start: "", end: "", worked: true }))
            );
          } else {
            setWorkData([]);
          }
        }}
        className="border p-1 rounded w-full mb-2"
      />

      <label>Heures requises par jour</label>
      <input
        type="number"
        value={requiredHours}
        onChange={(e) => setRequiredHours(e.target.value)}
        className="border p-1 rounded w-full mb-4"
      />

      {workData.map((day, idx) => (
        <div key={idx} className="mt-4 border p-3 rounded">
          <h2 className="font-semibold">Jour {idx + 1}</h2>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={day.worked}
              onChange={(e) => handleDayChange(idx, "worked", e.target.checked)}
            />
            J'ai travaillé ce jour
          </label>

          {day.worked && (
            <div className="flex gap-2 mt-2">
              <input
                type="time"
                value={day.start}
                onChange={(e) => handleDayChange(idx, "start", e.target.value)}
                className="border p-1 rounded"
              />
              <input
                type="time"
                value={day.end}
                onChange={(e) => handleDayChange(idx, "end", e.target.value)}
                className="border p-1 rounded"
              />
            </div>
          )}
        </div>
      ))}

      <div className="mt-6 border-t pt-4 space-y-1">
        <h2 className="font-bold">Résultats</h2>
        <p>Minutes manquantes: {results.totalMissingMinutes} min</p>
        <p>Minutes supplémentaires: {results.totalOvertimeMinutes} min</p>
        <p>Pénalité: {results.penalty.toFixed(2)} DA</p>
        <p>Prime: +{results.bonus.toFixed(2)} DA</p>
        <p>
          <strong>
            Salaire ajusté: {results.adjustedSalary.toFixed(2)} DA
          </strong>
        </p>
      </div>

      <button
        onClick={resetAll}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Tout réinitialiser
      </button>
    </div>
  );
};

export default App;
