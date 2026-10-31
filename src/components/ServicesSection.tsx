import { cn } from "cn";

type Service = {
  number: string;
  title: string;
  description: string;
  badgeClassName: string;
};

const services: Service[] = [
  {
    number: "1",
    title: "Lend a Book",
    description:
      "Share your favorite reads with the community by adding them to BookNook.",
    badgeClassName: "bg-red-500/20 text-red-400",
  },
  {
    number: "2",
    title: "Join a Club",
    description:
      "Participate in themed reading groups and discussions with fellow book lovers.",
    badgeClassName: "bg-yellow-500/20 text-yellow-400",
  },
  {
    number: "3",
    title: "Track Borrows",
    description:
      "Manage your borrowed books and return them at your convenience via My Borrows.",
    badgeClassName: "bg-green-500/20 text-green-400",
  },
];

export default function ServicesSection() {
  return (
    <section
      className="bg-white dark:bg-[#111721] px-5 py-16 sm:px-6 md:py-20 xl:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black dark:text-white">
            We make it easy to share, lend, and track books within our community.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.number}
              className="rounded-3xl border border-border bg-white dark:bg-gray-800 p-8 text-center transition-colors hover:border-indigo-500/20"
            >
              <span
                className={cn(
                  "mx-auto flex size-16 items-center justify-center rounded-2xl text-2xl font-bold",
                  service.badgeClassName,
                )}
              >
                {service.number}
              </span>

              <h3 className="mt-6 text-xl font-bold text-black dark:text-white">
                {service.title}
              </h3>

              <p className="mt-4 text-[15px] leading-relaxed text-black dark:text-white">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}