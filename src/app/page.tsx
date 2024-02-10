"use client";

import React, { type ChangeEvent, Fragment, useEffect } from "react";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CiSquarePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { api } from "~/trpc/react";
import Autocomplete from "./_components/input/Autocomplete";
import { CgEnter } from "react-icons/cg";

interface reservationType {
  id: number;
  client: { name: string; id: number };
  allowed: boolean;
  notes: string;
  arrivalTime: string | undefined;
  arrivalDate: string | undefined;
  updatedAt?: Date;
  createdAt?: Date;
}
const Reservations = () => {
  const ctx = api.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<reservationType>({
    id: -1,
    client: { name: "", id: -1 },
    allowed: false,
    notes: "",
    arrivalTime: new Date().toISOString().split("T")[1],
    arrivalDate: new Date().toISOString().split("T")[0],
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setForm({
      ...form,
      [name]: e.target.value,
    });
  };
  const handleChangSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const client = e as unknown as { name: string; id: number };
    setForm((prevData) => ({
      ...prevData,
      client: client,
    }));
  };
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevData) => ({
      ...prevData,
      arrivalDate: e.target.value,
    }));
  };
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevData) => ({
      ...prevData,
      arrivalTime: e.target.value,
    }));
  };
  useEffect(() => {
    setTimeout(() => {
      return void ctx.invalidate(guestList as unknown as undefined);
    }, 20000);
  });

  const { data: guestList } = api.reservations.getAll.useQuery();
  const { data: clientsList } = api.clients.getList.useQuery();
  const { mutate: deleteGuest } = api.reservations.delete.useMutation({
    onSuccess: () => {
      return void ctx.invalidate(guestList as unknown as undefined);
    },
    onError: (opts) => {
      console.error("Error:", opts.message[0]);
    },
  });
  const { mutate: addGuest } = api.reservations.add.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      return void ctx.invalidate(guestList as unknown as undefined);
    },
    onError: (opts) => {
      console.error("Error:", opts.message[0]);
    },
  });
  const { mutate: editGuest } = api.reservations.edit.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      return void ctx.invalidate(guestList as unknown as undefined);
    },
    onError: (opts) => {
      console.error("Error:", opts.message[0]);
    },
  });
  const editById = (item: reservationType) => {
    setForm({
      id: item.id,
      client: item.client,
      arrivalTime: item.arrivalTime,
      arrivalDate: item.arrivalDate,
      allowed: item.allowed,
      notes: item.notes,
    });
    setIsOpen(true);
  };
  const allowEntry = (item: reservationType) => {
    editGuest({
      id: item.id,
      allowed: true,
    });
  };
  const headers = ["Guest Name", "Position", "Time", "Allowed", "Actions"];
  const closeModal = () => {
    setIsOpen(false);
  };
  const submitModal = (data: reservationType) => {
    if (data.id === -1) {
      addGuest(data);
    } else {
      editGuest(data);
    }
  };
  return (
    <div className="container mx-auto my-4 rounded-xl border-2 border-gray-400 p-2 dark:text-gray-100">
      <div className="flex justify-between border-b-2 pb-2 ">
        <h2 className=" text-2xl font-semibold">Reservations</h2>
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
            {!guestList && (
              <tr>
                <td>Loading reservations...</td>
              </tr>
            )}
            {guestList?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-opacity-20 text-center even:bg-gray-50 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900"
              >
                <td className="p-3">{item.client.name}</td>
                <td className="p-3">{item.client.position}</td>
                <td className="p-3">
                  {item.arrivalDate + " - " + item.arrivalTime.toString()}
                </td>
                <td className="p-3">
                  {item.allowed ? "Allowed" : "Not Allowed"}
                </td>
                <td className="pl-3">
                  <button className="flex w-full items-center justify-center gap-2 text-xs font-semibold uppercase text-gray-700">
                    <span
                      className="hover:scale-110 hover:text-green-500"
                      onClick={() => {
                        allowEntry(item);
                      }}
                    >
                      <CgEnter size={16} />
                    </span>
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
                <Dialog.Panel className="h-[330px] w-[1000px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create a new Reservation
                  </Dialog.Title>
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4">
                    <Autocomplete
                      data={clientsList}
                      value={form.client}
                      setValue={handleChangSelection}
                      label="Client"
                    />
                    <div className="col-span-1 flex w-full gap-2">
                      <div className="w-full">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Arrival Date
                        </label>
                        <input
                          type="date"
                          onChange={handleDateChange}
                          value={form.arrivalDate}
                          className="block h-[52px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Arrival Time
                        </label>
                        <input
                          type="time"
                          onChange={handleTimeChange}
                          value={form.arrivalTime}
                          className="block h-[52px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Notes
                      </label>
                      <input
                        type="text"
                        name="notes"
                        onChange={handleChange}
                        value={form.notes}
                        className="block h-[52px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Important note..."
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

export default Reservations;
