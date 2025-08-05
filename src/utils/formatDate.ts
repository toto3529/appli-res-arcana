import { format } from "date-fns"
import { fr } from "date-fns/locale"

export const formatDateFr = (date: Date, formatStr = "dd/MM/yyyy") => format(date, formatStr, { locale: fr })
