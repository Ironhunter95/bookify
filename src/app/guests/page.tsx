"use client";

import React, { type ChangeEvent, Fragment, useEffect } from "react";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CiSquarePlus } from "react-icons/ci";
import { api } from "~/trpc/react";

interface guestType {
  id: number;
  name: string;
  position: string;
  updatedAt?: Date;
  createdAt?: Date;
}
const guest = () => {
  const Card = (guest: guestType) => {
    return (
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="flex justify-end px-4 pt-4"></div>
        <div className="flex flex-col items-center pb-10">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {guest.name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {guest.position}
          </span>
          <div className="mt-4 flex md:mt-6">
            <span
              className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => {
                editById(guest);
              }}
            >
              Edit
            </span>
            <span
              className="ms-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              onClick={() => {
                deleteGuest({ id: guest.id });
              }}
            >
              Delete
            </span>
          </div>
        </div>
      </div>
    );
  };
  const ctx = api.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    id: -1,
    name: "",
    position: "",
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      void ctx.invalidate(guestList);
    }, 20000);
  });

  const { data: guestList } = api.clients.getAll.useQuery();
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
  const editById = (item: guestType) => {
    setForm({
      id: item.id,
      name: item.name,
      position: item.position,
    });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const submitModal = (data: guestType) => {
    if (data.id === -1) {
      addGuest(data);
    } else {
      editGuest(data);
    }
  };
  return (
    <div className="my-4 ml-4 w-full rounded-xl border-gray-400 dark:text-gray-100">
      <div className="mx-5 flex justify-between pb-2">
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
      <div className="relative flex flex-wrap gap-5">
        {guestList?.map((guest) => (
          <Card id={guest.id} name={guest.name} position={guest.position} />
        ))}
        {/* <table className="w-full justify-between text-sm">
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
        </table> */}
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
