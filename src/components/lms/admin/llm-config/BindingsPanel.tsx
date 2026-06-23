"use client";

import { useMemo, useState } from"react";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Switch } from"@/components/ui/switch";
import {
 Dialog, DialogContent, DialogDescription, DialogFooter,
 DialogHeader, DialogTitle, DialogTrigger,
} from"@/components/ui/dialog";
import {
 Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from"@/components/ui/select";
import { Plus, Trash2 } from"lucide-react";
import type { LlmBinding, LlmCatalogue, LlmModel } from"@/services/llmConfigService";
import { llmConfigService } from"@/services/llmConfigService";

type Props = {
 bindings: LlmBinding[];
 models: LlmModel[];
 catalogue: LlmCatalogue | null;
 onChanged: () => void;
};

export function BindingsPanel({ bindings, models, catalogue, onChanged }: Props) {
 const byTask = useMemo(() => {
 const m = new Map<string, LlmBinding[]>();
 bindings.forEach((b) => {
 const arr = m.get(b.task_code) ?? [];
 arr.push(b);
 m.set(b.task_code, arr);
 });
 for (const arr of m.values()) arr.sort((a, b) => a.priority - b.priority);
 return m;
 }, [bindings]);

 const allTasks = useMemo(() => {
 const s = new Set<string>(catalogue?.task_codes ?? []);
 bindings.forEach((b) => s.add(b.task_code));
 return Array.from(s).sort();
 }, [catalogue, bindings]);

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-semibold text-text-heading">Task bindings</h2>
 <p className="text-sm text-text-muted">
 Mỗi task có fallback chain xếp theo priority. Bật <b>Pin</b> để ép gateway chỉ dùng đúng binding này.
 </p>
 </div>
 <BindingDialog models={models} catalogue={catalogue} onSaved={onChanged} />
 </div>

 <div className="space-y-3">
 {allTasks.map((task) => {
 const chain = byTask.get(task) ?? [];
 const hasBindings = chain.length > 0;
 return (
 <div key={task} className="rounded-xl border border-border-subtle overflow-hidden">
 {/* Task header */}
 <div className="flex items-center justify-between bg-bg-root dark:bg-bg-card/60 px-4 py-3 border-b border-border-subtle">
 <div className="flex items-center gap-3">
 <code className="text-sm font-mono font-semibold text-text-subheading">{task}</code>
 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
 hasBindings
 ?"bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
 :"bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
 }`}>
 {chain.length} binding{chain.length !== 1 ?"s" :""}
 </span>
 </div>
 <BindingAddInline task={task} models={models} onSaved={onChanged} />
 </div>

 {chain.length === 0 ? (
 <p className="px-4 py-4 text-sm text-text-disabled italic">Chưa có binding. Nhấn + Model để thêm.</p>
 ) : (
 <table className="w-full text-sm">
 <thead className="text-text-disabled text-xs uppercase tracking-wide bg-bg-card dark:bg-bg-root">
 <tr>
 <th className="px-4 py-2 text-left w-28">Priority</th>
 <th className="px-4 py-2 text-left">Model</th>
 <th className="px-4 py-2 text-center w-20">JSON</th>
 <th className="px-4 py-2 text-right w-32">Temp / Max</th>
 <th className="px-4 py-2 text-center w-20">Pin</th>
 <th className="px-4 py-2 text-center w-20">Bật</th>
 <th className="px-4 py-2 w-16" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border-section dark:divide-border-section/60">
 {chain.map((b) => (
 <BindingRow key={b.id} binding={b} onChanged={onChanged} />
 ))}
 </tbody>
 </table>
 )}
 </div>
 );
 })}
 {allTasks.length === 0 && (
 <p className="text-center py-12 text-text-disabled text-sm">
 Chưa có binding nào. Nhấn <span className="font-medium text-blue-600">+ Thêm binding</span> để bắt đầu.
 </p>
 )}
 </div>
 </div>
 );
}

function BindingRow({ binding, onChanged }: { binding: LlmBinding; onChanged: () => void }) {
 const [busy, setBusy] = useState(false);
 const [priority, setPriority] = useState(String(binding.priority));
 const [jsonMode, setJsonMode] = useState(binding.json_mode);
 const [isPinned, setIsPinned] = useState(binding.pinned);
 const [isEnabled, setIsEnabled] = useState(binding.enabled);

 const patch = async (data: Parameters<typeof llmConfigService.updateBinding>[1]) => {
 setBusy(true);
 try { await llmConfigService.updateBinding(binding.id, data); onChanged(); }
 finally { setBusy(false); }
 };

 const commitPriority = () => {
 const n = Number(priority);
 if (!isNaN(n) && n !== binding.priority) patch({ priority: n });
 };

 const toggleJson = (v: boolean) => { setJsonMode(v); patch({ json_mode: v }); };
 const togglePin = (v: boolean) => { setIsPinned(v); patch({ pinned: v }); };
 const toggleEnabled = (v: boolean) => { setIsEnabled(v); patch({ enabled: v }); };

 const remove = async () => {
 if (!confirm(`Xoá binding ${binding.task_code} → ${binding.model.model_name}?`)) return;
 setBusy(true);
 try { await llmConfigService.deleteBinding(binding.id); onChanged(); }
 finally { setBusy(false); }
 };

 return (
 <tr className="hover:bg-bg-section dark:hover:bg-bg-root/30 transition-colors">
 <td className="px-4 py-3">
 <Input
 type="number"
 className="h-7 w-20 rounded-lg text-center tabular-nums border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20"
 value={priority}
 onChange={(e) => setPriority(e.target.value)}
 onBlur={commitPriority}
 onKeyDown={(e) => e.key ==="Enter" && commitPriority()}
 disabled={busy}
 />
 </td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-1.5">
 <code className="text-xs font-mono text-text-muted">{binding.model.provider_code}</code>
 <span className="text-text-disabled dark:text-text-muted">/</span>
 <code className="text-xs font-mono font-medium text-text-body">{binding.model.model_name}</code>
 </div>
 </td>
 <td className="px-4 py-3 text-center">
 <Switch checked={jsonMode} onCheckedChange={toggleJson} disabled={busy} />
 </td>
 <td className="px-4 py-3 text-right text-xs tabular-nums text-text-muted">
 {binding.temperature ?? binding.model.default_temperature} / {binding.max_tokens ?? binding.model.default_max_tokens}
 </td>
 <td className="px-4 py-3 text-center">
 <Switch checked={isPinned} onCheckedChange={togglePin} disabled={busy}
 className="data-[state=checked]:bg-amber-500" />
 </td>
 <td className="px-4 py-3 text-center">
 <Switch checked={isEnabled} onCheckedChange={toggleEnabled} disabled={busy} />
 </td>
 <td className="px-4 py-3 text-right">
 <Button
 variant="ghost" size="sm"
 className="h-7 w-7 p-0 text-text-disabled hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 active:scale-95 transition-all duration-200"
 onClick={remove} disabled={busy}
 title="Xoá binding"
 >
 <Trash2 className="h-4 w-4" />
 </Button>
 </td>
 </tr>
 );
}


function BindingAddInline({
 task, models, onSaved,
}: {
 task: string;
 models: LlmModel[];
 onSaved: () => void;
}) {
 const [open, setOpen] = useState(false);
 const [modelId, setModelId] = useState<string>("");
 const [priority, setPriority] = useState("100");
 const [saving, setSaving] = useState(false);

 const add = async () => {
 if (!modelId) return;
 setSaving(true);
 try {
 await llmConfigService.upsertBinding({
 task_code: task,
 model_id: Number(modelId),
 priority: Number(priority),
 });
 setOpen(false);
 onSaved();
 } finally { setSaving(false); }
 };

 return (
 <Dialog open={open} onOpenChange={setOpen}>
 <DialogTrigger asChild>
 <Button size="sm" variant="outline"
 className="gap-1.5 h-7 text-xs active:scale-95 transition-all duration-200"
 >
 <Plus className="h-3 w-3" /> Model
 </Button>
 </DialogTrigger>
 <DialogContent className="max-w-sm">
 <DialogHeader>
 <DialogTitle className="text-base font-semibold">Thêm model vào chain</DialogTitle>
 <DialogDescription>
 Task: <code className="font-mono text-sm bg-bg-section px-1.5 py-0.5 rounded">{task}</code>
 </DialogDescription>
 </DialogHeader>
 <div className="space-y-4 py-1">
 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-text-body">
 Model <span className="text-rose-500">*</span>
 </Label>
 <Select value={modelId} onValueChange={setModelId}>
 <SelectTrigger className="rounded-xl border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20">
 <SelectValue placeholder="Chọn model" />
 </SelectTrigger>
 <SelectContent>
 {models.map((m) => (
 <SelectItem key={m.id} value={String(m.id)}>
 <code className="font-mono text-xs">{m.provider_code}</code>
 <span className="text-text-disabled mx-1">/</span>
 {m.model_name}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-1.5">
 <Label htmlFor="add-priority" className="text-sm font-medium text-text-body">
 Priority <span className="text-text-disabled font-normal text-xs">(thấp hơn = thử trước)</span>
 </Label>
 <Input
 id="add-priority" type="number" value={priority}
 onChange={(e) => setPriority(e.target.value)}
 className="rounded-xl border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20"
 />
 </div>
 </div>
 <DialogFooter>
 <Button
 onClick={add} disabled={saving || !modelId}
 className="bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl px-5 shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
 >
 {saving ?"Đang thêm…" :"Thêm"}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}

function BindingDialog({
 models, catalogue, onSaved,
}: {
 models: LlmModel[];
 catalogue: LlmCatalogue | null;
 onSaved: () => void;
}) {
 const [open, setOpen] = useState(false);
 const [taskCode, setTaskCode] = useState<string>(catalogue?.task_codes?.[0] ??"chat");
 const [customTask, setCustomTask] = useState("");
 const [modelId, setModelId] = useState<string>("");
 const [priority, setPriority] = useState("100");
 const [saving, setSaving] = useState(false);

 const effectiveTask = taskCode ==="__custom" ? customTask.trim() : taskCode;

 const save = async () => {
 if (!modelId || !effectiveTask) return;
 setSaving(true);
 try {
 await llmConfigService.upsertBinding({
 task_code: effectiveTask,
 model_id: Number(modelId),
 priority: Number(priority),
 });
 setCustomTask(""); setModelId(""); setPriority("100");
 setOpen(false);
 onSaved();
 } finally { setSaving(false); }
 };

 return (
 <Dialog open={open} onOpenChange={setOpen}>
 <DialogTrigger asChild>
 <Button
 disabled={models.length === 0}
 className="gap-2 bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl px-5 shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
 >
 <Plus className="h-4 w-4" /> Thêm binding
 </Button>
 </DialogTrigger>
 <DialogContent className="max-w-md">
 <DialogHeader>
 <DialogTitle className="text-lg font-semibold">Thêm task binding</DialogTitle>
 <DialogDescription className="text-text-muted">
 Chọn task code và model. Priority thấp hơn được thử trước.
 </DialogDescription>
 </DialogHeader>
 <div className="space-y-4 py-1">
 {/* Task code */}
 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-text-body">
 Task code <span className="text-rose-500">*</span>
 </Label>
 <Select value={taskCode} onValueChange={setTaskCode}>
 <SelectTrigger className="rounded-xl border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 {(catalogue?.task_codes ?? []).map((t) => (
 <SelectItem key={t} value={t}><code className="font-mono text-xs">{t}</code></SelectItem>
 ))}
 <SelectItem value="__custom" className="text-text-muted italic">— Tự định nghĩa —</SelectItem>
 </SelectContent>
 </Select>
 {taskCode ==="__custom" && (
 <Input
 className="mt-2 rounded-xl border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20 font-mono"
 value={customTask}
 onChange={(e) => setCustomTask(e.target.value)}
 placeholder="my_custom_task"
 />
 )}
 </div>

 {/* Model */}
 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-text-body">
 Model <span className="text-rose-500">*</span>
 </Label>
 <Select value={modelId} onValueChange={setModelId}>
 <SelectTrigger className="rounded-xl border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20">
 <SelectValue placeholder="Chọn model" />
 </SelectTrigger>
 <SelectContent>
 {models.map((m) => (
 <SelectItem key={m.id} value={String(m.id)}>
 <code className="font-mono text-xs">{m.provider_code}</code>
 <span className="text-text-disabled mx-1">/</span>
 {m.model_name}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 {/* Priority */}
 <div className="space-y-1.5">
 <Label htmlFor="bind-priority" className="text-sm font-medium text-text-body">
 Priority <span className="text-text-disabled font-normal text-xs">(thấp hơn = thử trước)</span>
 </Label>
 <Input
 id="bind-priority" type="number" value={priority}
 onChange={(e) => setPriority(e.target.value)}
 className="rounded-xl border-border-input bg-bg-section focus:ring-2 focus:ring-border-focus/20"
 />
 </div>
 </div>
 <DialogFooter>
 <Button
 onClick={save} disabled={saving || !modelId || !effectiveTask}
 className="bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl px-6 shadow-sm active:scale-95 transition-all duration-200 disabled:opacity-50"
 >
 {saving ?"Đang lưu…" :"Lưu"}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}