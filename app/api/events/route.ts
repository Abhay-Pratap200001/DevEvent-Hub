import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    let event: Record<string, FormDataEntryValue | FormDataEntryValue[]>;

    try {
      event = {};
      for (const [key, value] of formData.entries()) {
        const existing = event[key];
        if (existing === undefined) {
          event[key] = value;
        } else if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          event[key] = [existing, value];
        }
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 },
      );
    }

    const file = formData.get("image") as File;

    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .unsigned_upload_stream(
          "DEVHUN",
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createEvent = await Event.create(event);
    return NextResponse.json(
      { message: "Event created successfully", event: createEvent },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Event Created Failed",
        error:
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: unknown }).message)
              : "Unknown error",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Event fetched successfully", events },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Event fetching failed", error: error },
      { status: 500 },
    );
  }
}

