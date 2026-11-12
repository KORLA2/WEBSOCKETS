import { differenceInDays, format, isToday, isYesterday } from "date-fns";

export const formatTime=(createdAt:Date)=>{
    console.log("FOrmatting..." , createdAt)

    if(isToday(createdAt))return format(createdAt,"hh:mm a");

    if(isYesterday(createdAt)) return "Yesterday";
    if(differenceInDays(new Date(),createdAt)<7)
        return format(createdAt,"EE");

    return format(createdAt,"dd/MM/yyyy") ;

}