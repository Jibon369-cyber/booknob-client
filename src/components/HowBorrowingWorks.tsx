import { cn } from "cn";

type Step = {
  number: string;
  title: string;
  description: string;
  badgeClassName: string;
};

const steps: Step[] = [
  {
    number: "1",
    title: "Find Your Book",
    description:
      "Browse our collection by genre, author, or search keyword to find the title you want.",
    badgeClassName: "bg-indigo-500/20 text-indigo-500",
  },
  {
    number: "2",
    title: "Request & Borrow",
    description:
      "Log in and choose your borrowing duration (7, 14, or 30 days). Decreases copy count by 1.",
    badgeClassName: "bg-amber-500/20 text-amber-500",
  },
  {
    number: "3",
    title: "Read & Return",
    description:
      'Enjoy your book! When finished, return it via "My Borrows" to restore the available copy count.',
    badgeClassName: "bg-teal-500/20 text-teal-400",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section
      className="bg-background px-5 py-16 sm:px-6 md:py-20 xl:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">
            How Borrowing Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black dark:text-white">
            Borrowing books from BookNook is free, flexible, and simple. Three
            easy steps to start reading.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-border bg-white dark:bg-[#111a2c] p-8 text-center transition-colors hover:border-white/20"
            >
              <span
                className={cn(
                  "mx-auto flex size-16 items-center justify-center rounded-2xl text-2xl font-bold",
                  step.badgeClassName,
                )}
              >
                {step.number}
              </span>
              <h3 className="mt-6 text-xl font-bold text-black dark:text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
