import { Button } from '@/components/ui/button'
import React from 'react'
import { ServerOff } from 'lucide-react'

interface ErrorPageProps {
    icon?: React.ComponentType<any>
    title?: string
    description?: string
}

const defaultProps: ErrorPageProps = {
    icon: ServerOff,
    title: 'Installation Failed',
    description: 'Installation Token Not Detected or Unauthorized Account.',
}

const ErrorPage: React.FC<ErrorPageProps> = ({ icon: Icon = defaultProps.icon, title = defaultProps.title, description = defaultProps.description }) => {
    return (
        <div className='w-dvw h-full flex flex-col items-center justify-center gap-5'>
            {Icon && <Icon className='w-36 h-36 stroke-1' />}
            <div className=' text-4xl font-semibold'>
                {title}
            </div>

            <div className=' opacity-50 flex items-center flex-col'>
                {description}
            </div>

            <Button className='mt-5 font-semibold' size="lg">
                Go back to home
            </Button>

            <Button variant="link" size="icon">
                Re-Install
            </Button>
        </div>
    )
}

export default ErrorPage;
