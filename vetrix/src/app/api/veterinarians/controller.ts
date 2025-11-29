import { NextResponse } from "next/server"
import { validateIdParam, validateRequest } from "@/lib/utils/validation/validators"
import { createVeterinarianSchema, updateVeterinarianSchema } from "./validator"
import * as service from "./service"
import { handleApiError } from "@/lib/utils/error-handler"

export async function getVeterinarians() {
  try {
    const data = await service.getAllVeterinarians()
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function getVeterinarianById(_: Request, { params }: { params: { id: string } }) {
  try {
    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) return NextResponse.json({ error: idValidation.error }, { status: 400 })

    const data = await service.getVeterinarianById(idValidation.id.toString())
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function createVeterinarian(request: Request) {
  try {
    const validation = await validateRequest(createVeterinarianSchema)(request)
    if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 })

    const data = await service.createVeterinarian(validation.data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function updateVeterinarian(request: Request, { params }: { params: { id: string } }) {
  try {
    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) return NextResponse.json({ error: idValidation.error }, { status: 400 })

    const validation = await validateRequest(updateVeterinarianSchema)(request)
    if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 })

    const data = await service.updateVeterinarian(idValidation.id.toString(), validation.data)
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function deleteVeterinarian(_: Request, { params }: { params: { id: string } }) {
  try {
    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) return NextResponse.json({ error: idValidation.error }, { status: 400 })

    await service.deleteVeterinarian(idValidation.id.toString())
    return NextResponse.json({ message: "Veterinarian deleted successfully" })
  } catch (error) {
    return handleApiError(error)
  }
}