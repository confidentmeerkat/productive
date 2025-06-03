"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Copy, MoreHorizontal, Plus } from "lucide-react"
import { toast } from "sonner"
import { ApiKeyInfo, apikeyService } from "@/services/apikeyService"
import useSWR from "swr"

export default function ApiKeysPage() {
  const { data: apiKeys = [], mutate } = useSWR<ApiKeyInfo[]>("/api-keys", apikeyService.getApiKeys)

  const [newKeyName, setNewKeyName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return

    apikeyService.createApiKey(newKeyName).then((newKey) => {
      mutate()
      setNewKeyName("")
      setNewKey(newKey.key)
    })
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("API key copied", {
      description: "The API key has been copied to your clipboard",
    })
  }

  const handleRevokeKey = (id: number) => {
    apikeyService.deleteApiKey(id).then(() => {
      mutate()
      toast.success("API key revoked", {
        description: "The API key has been revoked successfully",
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage your API keys for different applications and environments.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                {newKey
                  ? "Your new API key has been created. Make sure to copy it now as you won't be able to see it again."
                  : "Give your API key a name to help you identify it later."}
              </DialogDescription>
            </DialogHeader>
            {!newKey ? (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">API Key Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Production API, Test Environment"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey}>Create Key</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="api-key">Your New API Key</Label>
                    <div className="flex items-center gap-2">
                      <Input id="api-key" value={newKey} readOnly className="font-mono text-sm" />
                      <Button size="icon" variant="outline" onClick={() => handleCopyKey(newKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This key will only be displayed once and cannot be retrieved later.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false)
                      setNewKey(null)
                    }}
                  >
                    Done
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            View and manage all your API keys. Keep these secure and never share them publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(apiKeys || []).map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.label}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                        {apiKey.prefix}...
                      </code>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopyKey(apiKey.prefix)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{apiKey.createdAt.toLocaleString()}</TableCell>
                  <TableCell>{apiKey.lastUsedAt?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.isActive ? "default" : "secondary"}>{apiKey.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyKey(apiKey.prefix)}>Copy API Key</DropdownMenuItem>
                        {apiKey.isActive && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleRevokeKey(apiKey.id)}
                          >
                            Revoke Key
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {apiKeys?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No API keys found. Create your first API key to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
