"use client";

import React, { type ChangeEvent, Fragment, useEffect } from "react";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CiSquarePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { api } from "~/trpc/react";
const guest = () => {
  const ctx = api.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    id: -1,
    name: "",
    position: "",
    unit: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setForm({
      ...form,
      [name]: e.target.value,
    });
  };
  useEffect(() => {
    setTimeout(() => {
      void ctx.invalidate(guestList);
    }, 20000);
  });

  const { data: guestList } = api.clients.getAll.useQuery({
    page: page,
    query: query,
  });
  const { mutate: deleteGuest } = api.clients.delete.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      void ctx.invalidate(guestList);
    },
    onError: (opts) => {
      console.error("Error:", opts.message[0]);
    },
  });
  const { mutate: addGuest } = api.clients.add.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      void ctx.invalidate(guestList);
      setIsOpen(false);
    },
    onError: (opts) => {
      console.error("Error:", opts.message[0]);
    },
  });
  const { mutate: editGuest } = api.clients.edit.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      void ctx.invalidate(guestList);
      setIsOpen(false);
    },
    onError: (opts) => {
      console.error("Error:", opts.message[0]);
    },
  });
  const editById = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      position: item.position,
      unit: item.unit,
    });
    setIsOpen(true);
  };

  const headers = ["Name", "Position", "Unit", "Actions"];
  const closeModal = () => {
    setIsOpen(false);
  };
  const submitModal = (data) => {
    if (data.id === -1) {
      addGuest(data);
    } else {
      editGuest(data);
    }
  };
  return (
    <div className="container mx-auto my-4 rounded-xl border-2 border-gray-400 p-2 dark:text-gray-100">
      <div className="flex justify-between border-b-2 pb-2 ">
        <h2 className=" text-2xl font-semibold">Guests</h2>
        <button
          className="text-xs font-semibold uppercase text-gray-700"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <CiSquarePlus size={24} />
        </button>
      </div>
      <div className="relative">
        <table className="w-full justify-between text-sm">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead className="dark:bg-gray-700">
            <tr className="text-center">
              {headers.map((header, index) => (
                <th className="p-3" key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guestList?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-opacity-20 text-center odd:bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900"
              >
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.position}</td>
                <td className="p-3">{item.unit}</td>
                <td className="place-content-center place-items-center justify-center p-3 align-middle">
                  <button className="flex w-full items-center justify-center gap-2  text-xs font-semibold uppercase text-gray-700">
                    <span
                      className="hover:scale-110 hover:text-orange-300"
                      onClick={() => {
                        editById(item);
                      }}
                    >
                      <FaRegEdit size={16} />
                    </span>
                    <span
                      className="hover:scale-110 hover:text-red-800"
                      onClick={() => {
                        deleteGuest({ id: item.id });
                      }}
                    >
                      <AiOutlineDelete size={16} />
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[1000px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add a new Guest
                  </Dialog.Title>
                  <div className="grid grid-cols-1 grid-rows-5 gap-4 p-4 md:grid-cols-2 md:grid-rows-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="John"
                        required
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        onChange={handleChange}
                        value={form.position}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="CEO"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Unit
                      </label>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="unit"
                        value={form.unit}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Unit X"
                        required
                      />
                    </div>
                  </div>
                  <div className="mr-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-slate-600 disabled:text-white"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-slate-600 disabled:text-white"
                      onClick={() => submitModal(form)}
                    >
                      Finish
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default guest;
