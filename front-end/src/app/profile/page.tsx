"use client";
import RequireAuth from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fetchUserProfile } from "@/lib/redux/features/user/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Root } from "postcss";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  return (
    <RequireAuth>
      <h1>ProfilePage</h1>
      <span>{user?.username}</span>
      <span>{user?.email}</span>
      <span>{user?.fullname}</span>
      <span>{user?.roles}</span>
    </RequireAuth>
  );
}
