import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SendPasswordReset({ email }) {
  const [state, setState] = useState("idle");
  const { toast } = useToast();

  const send = async () => {
    if (!window.confirm(`向 ${email} 发送重置密码邮件？`)) return;
    setState("sending");
    try {
      await base44.auth.resetPasswordRequest(email);
      setState("sent");
      toast({ title: "已发送重置密码邮件", description: email });
    } catch (e) {
      setState("idle");
      toast({ title: "发送失败", description: e?.message || "请稍后重试", variant: "destructive" });
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={send} disabled={state === "sending"} className="gap-1">
      {state === "sending" ? <Loader2 className="w-3 h-3 animate-spin" /> : state === "sent" ? <Check className="w-3 h-3 text-green-600" /> : <KeyRound className="w-3 h-3" />}
      {state === "sent" ? "已发送" : "重置密码"}
    </Button>
  );
}