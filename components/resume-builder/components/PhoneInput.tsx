import { useState, useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneInputComponentProps {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
  };
  
export const PhoneInputComponent = ({ register, errors }: PhoneInputComponentProps) => {
    const storedData = localStorage.getItem("resumeitnow_form_data");
    const defaultPhone = storedData ? JSON.parse(storedData)?.formData?.personalDetails?.phone || "" : "";
    const [defaultCountryCode, phone] = defaultPhone.split(" ");
    const [countryCode, setCountryCode] = useState(defaultCountryCode || "+91");
    const [phoneNumber, setPhoneNumber] = useState(phone);
  
    useEffect(() => {
      const fullNumber = `${countryCode} ${phoneNumber}`;
      register("personalDetails.phone").onChange({
        target: { value: fullNumber, name: "personalDetails.phone" }
      });
    }, [countryCode, phoneNumber, register]);
  
    return (
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[100px]">
              <SelectValue>{countryCode}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+91">+91 (IN)</SelectItem>
              <SelectItem value="+1">+1 (US)</SelectItem>
              <SelectItem value="+44">+44 (UK)</SelectItem>
              <SelectItem value="+92">+92 (PAK)</SelectItem>
              <SelectItem value="+94">+94 (LK)</SelectItem>
              <SelectItem value="+880">+880 (BD)</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="123-456-7890"
          />
        </div>
        {errors.personalDetails?.phone && 
          <p className="text-destructive text-sm">{errors.personalDetails.phone.message}</p>}
      </div>
    );
  };