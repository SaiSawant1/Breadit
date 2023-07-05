'use client'
import { UserNameRequest, UserNameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

interface UserNameFormProps {
    user:Pick<User,"id"|"username">
}

type FormData = z.infer<typeof UserNameValidator>

const UserNameForm: React.FC<UserNameFormProps> = ({user}) => {

    const {handleSubmit,register,formState:{errors}}=useForm<UserNameRequest>({
        resolver:zodResolver(UserNameValidator),
        defaultValues:{
            name:user?.username||""
        }
    })
    const router = useRouter()
    const {mutate:changeUsername,isLoading,}=useMutation({
        mutationFn:async({name}:FormData)=>{
            const payload:UserNameRequest={
                name
            }
            const {data}= await axios.patch(`/api/username/`,payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
              if (err.response?.status === 409) {
                return toast({
                  title: 'Username already taken.',
                  description: 'Please choose another username.',
                  variant: 'destructive',
                })
              }
            }
      
            return toast({
              title: 'Something went wrong.',
              description: 'Your username was not updated. Please try again.',
              variant: 'destructive',
            })
          },
          onSuccess: () => {
            toast({
              description: 'Your username has been updated.',
            })
            router.refresh()
          },
    })

  return (
    <form onSubmit={handleSubmit((e)=>changeUsername(e))}>
        <Card>
            <CardHeader>
                <CardTitle>Your Username</CardTitle>
                <CardDescription>
                    Enter your username you are comfortable with
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='relative grid gap-1'>
                    <div className='absolute place-items-center top-0 left-0 w-8 h-10 grid'>
                        <span className='text-sm text-zinc-500'>
                            u/
                        </span>
                    </div>
                    <Label htmlFor='name' className='sr-only '>Name</Label>
                    <Input id='name' size={32} {...register('name')} className='w-[400px] pl-6' />
                    {errors?.name&&(
                        <p className='px-1 text-xs text-red-600'>
                            {errors.name.message}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button isLoading={isLoading}>
                        Change Name
                </Button>
            </CardFooter>
        </Card>
    </form>
  )
}

export default UserNameForm