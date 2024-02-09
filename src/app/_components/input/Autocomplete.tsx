import { type ChangeEvent, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FaChevronUp, FaChevronDown, FaCheck } from "react-icons/fa";
const Autocomplete = ({
  data,
  value,
  setValue,
  label,
}: {
  data: { name: string; id: number }[] | undefined;
  value: { name: string; id: number } | null;
  setValue: (
    e: ChangeEvent<HTMLInputElement>,
    value: { name: string; id: number } | null,
  ) => void;
  label: string;
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filteredPeople =
    query === ""
      ? data
      : data?.filter((client: { name: string }) =>
          client.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );
  return (
    <div className="flex-col">
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="flex h-full">
        <div className="w-full ">
          <Combobox value={value} onChange={setValue as unknown as undefined}>
            <div className="relative mt-1">
              <div className="relative block h-12 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                <Combobox.Input
                  className="w-full border-none bg-gray-50 py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(client: { name: string; id: number }) =>
                    client?.name ?? ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={() => setOpen(!open)}
                >
                  {open ? (
                    <FaChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <FaChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-y-auto rounded-md bg-gray-50 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredPeople &&
                  filteredPeople.length === 0 &&
                  query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredPeople?.map(
                      (person: { id: number; name: string }) => (
                        <Combobox.Option
                          key={person.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-blue-600"
                                  }`}
                                >
                                  <FaCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ),
                    )
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
      </div>
    </div>
  );
};
export default Autocomplete;
