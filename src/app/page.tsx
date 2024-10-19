import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="flex gap-5 p-10">
      HomePage
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
    </div>
  );
};

export default HomePage;
