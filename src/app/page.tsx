import Banner from "@/components/Banner";
import HowBorrowingWorks from "@/components/HowBorrowingWorks";
import NewArrivals from "@/components/New-arrival";
import ServicesSection from "@/components/ServicesSection";

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      <Banner />
      <NewArrivals />
      <HowBorrowingWorks />
      <ServicesSection />
    </main>
  );
}
