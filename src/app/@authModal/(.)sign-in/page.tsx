import CloseModal from "@/components/ui/CloseModal";
import SignIn from "@/components/ui/SignIn";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return <div className="fixed inset-0 bg-zinc-900/20 z-10">
    <div className="flex container items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-2 px-2 rounded-lg">
            <div className="absolute top-4 right-4">
                <CloseModal/>
            </div>
            <SignIn/>
        </div>
    </div>
  </div>;
};
export default page
