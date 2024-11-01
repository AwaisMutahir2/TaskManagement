import { jwtVerify } from 'jose'

export const verifyToken = async (token: string): Promise<any> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    throw new Error('Token verification failed')
  }
}
