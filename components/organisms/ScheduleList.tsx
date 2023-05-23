"use client";

import { ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultButton, DefaultCol, DefaultInput, DefaultRow } from "../atoms/DefaultAtoms";
import { logOut } from "@/services/firebase/auth";
import { styled } from "styled-components";
import { Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { ScheduleRow } from "../atoms/CustomAtoms";

interface ScheduleListProps {
  scheduleData: ScheduleType[];
}

export default function ScheduleList({
  scheduleData
}: ScheduleListProps) {
  const router = useRouter();

  const scheduleList = scheduleData.map((value) =>
    <ScheduleRow key={value?.id}>
      <DefaultCol>
        {value?.content}
      </DefaultCol>
    </ScheduleRow>
  );
  
  return (
    <>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton onClick={async () => {
            await logOut();
            router.push("/signin");
          }}>Sign Out</DefaultButton>
        </DefaultCol>
      </DefaultRow>
      {scheduleList}
    </>
  );
}
