import { NextResponse } from "next/server";
const baseUrl = process?.env?.API_BASE_URL;

const API_URL = `${baseUrl}services/app/category/GetAllCategories?includeProductCount=true`;
export async function POST() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed
      },
    });

    const result = await response.json();
    return NextResponse.json(result.result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong with the POST request",
    });
  }
}