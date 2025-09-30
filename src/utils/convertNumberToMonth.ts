/*************  ✨ Windsurf Command ⭐  *************/
export const convertNumberToMonth = (number: number): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months[number - 1];
};