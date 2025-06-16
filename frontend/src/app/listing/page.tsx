'use client'
import RoommateSwiper from "@/components/ListingComp";
import { Suspense } from "react";

export default function Listing(){
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <RoommateSwiper/>
      </Suspense>
  )
}