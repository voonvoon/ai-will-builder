import { Popover } from '@/components/ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { PaletteIcon } from 'lucide-react';
import {useState} from 'react';
import{Color, ColorChangeHandler, TwitterPicker} from 'react-color';
import { Button } from '@/components/ui/button';
import { useSubscriptionLevel } from '../SubscriptionLevelProvider';
import usePremiumModal from '@/hooks/usePremiumModal';
import { canUseCustomizations } from '@/lib/permissions';

interface ColorPickerProps {
    color: Color | undefined; // The current color value, Color is a type from react-color or a string
    onChange: ColorChangeHandler // A function to handle color changes
}


export default function ColorPicker({color, onChange}:ColorPickerProps){

    const subscriptionLevel = useSubscriptionLevel(); 

    const premiumModal = usePremiumModal();
    

    const [showPopover, setShowPopover] = useState(false); // A state variable to manage the visibility of the color picker popover

    return <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>  
            <Button
                variant="outline"
                size="icon"
                title='Change color'
                onClick={() => {
                    if(!canUseCustomizations(subscriptionLevel)){ 
                        premiumModal.setOpen(true);
                        return;
                    }
                    setShowPopover(true)}}
            >
                <PaletteIcon className='size-5'/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='border-none bg-transparent shadow-none' align='end'>
            <TwitterPicker color={color} onChange={onChange} triangle='top-right' className='mt-3'/>
        </PopoverContent>

    </Popover>


}