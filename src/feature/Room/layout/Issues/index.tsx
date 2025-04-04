import Issues from "../../../Issues";

export const IssuesList = () => {
  return (
    <div className="col-span-2 gap-4 pr-2 max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
      <div className="p-4 bg-transparent w-full">
        <Issues />
      </div>
    </div>
  );
};
