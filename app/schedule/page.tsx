import Schedule from "@/components/templates/Schedule";

const SchedulePage = async () => {
  await (async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    })
  })();
  return <Schedule/>
}

export default SchedulePage;