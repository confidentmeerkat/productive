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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Edit, MoreHorizontal, Plus, Trash2, ExternalLink, User } from "lucide-react"
import { toast } from 'sonner'
import { AccountDetails, AccountInfo, accountsService } from "@/services/accountsService"
import useSWR from "swr"

// Mock current user ID
const CURRENT_USER_ID = 1

// Account types
const ACCOUNT_TYPES = [
  { value: "upwork", label: "Upwork", icon: "💼" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  //   { value: "freelancer", label: "Freelancer", icon: "🔧" },
  //   { value: "fiverr", label: "Fiverr", icon: "🎯" },
  //   { value: "toptal", label: "Toptal", icon: "⭐" },
  //   { value: "guru", label: "Guru", icon: "🧠" },
  //   { value: "peopleperhour", label: "PeoplePerHour", icon: "⏰" },
  //   { value: "99designs", label: "99designs", icon: "🎨" },
]

// Status options
const STATUS_OPTIONS = [
  { value: "active", label: "Active", variant: "default" as const },
  { value: "inactive", label: "Inactive", variant: "secondary" as const },
  { value: "suspended", label: "Suspended", variant: "destructive" as const },
  { value: "pending", label: "Pending", variant: "outline" as const },
]


export default function AccountsPage() {
  const { data: accounts, mutate } = useSWR<AccountInfo[]>("/accounts", accountsService.getAccounts)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountInfo | null>(null)
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    status: "active",
    profileUrl: "",
    description: "",
  })

  const resetForm = () => {
    setFormData({
      type: "",
      name: "",
      status: "active",
      profileUrl: "",
      description: "",
    })
  }

  const handleCreateAccount = () => {
    if (!formData.type || !formData.name) {
      toast.error("Please fill in all required fields")
      return
    }

    const newAccount: AccountDetails = {
      type: formData.type,
      name: formData.name,
      status: formData.status,
      meta: {
        profileUrl: formData.profileUrl,
        description: formData.description,
        createdBy: "user",
      },
    }

    accountsService.createAccount(newAccount).then(() => {
      mutate()
    })

    setIsCreateDialogOpen(false)
    resetForm()
    toast.success("Account created successfully")
  }

  const handleEditAccount = () => {
    if (!editingAccount || !formData.name) return

    accountsService.updateAccount(editingAccount.id, {
      ...formData,
      meta: {
        ...editingAccount.meta,
        profileUrl: formData.profileUrl,
        description: formData.description,
      },
    }).then(() => {
      mutate()
    })

    setIsEditDialogOpen(false)
    setEditingAccount(null)
    resetForm()
    toast.success("Account updated successfully")
  }

  const handleDeleteAccount = (accountId: number) => {
    accountsService.deleteAccount(accountId).then(() => {
      mutate()
    })
    toast.success("Account deleted successfully")
  }

  const openEditDialog = (account: AccountInfo) => {
    setEditingAccount(account)
    setFormData({
      type: account.type,
      name: account.name,
      status: account.status,
      profileUrl: account.meta.profileUrl || "",
      description: account.meta.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const getAccountTypeInfo = (type: string) => {
    return ACCOUNT_TYPES.find((t) => t.value === type) || { label: type, icon: "🔗" }
  }

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || { label: status, variant: "secondary" as const }
  }

  const isOwner = (account: AccountInfo) => account.userId === CURRENT_USER_ID

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your job site accounts and view other users&apos; accounts in the platform.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Add a new job site account to your profile.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Platform *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Username/Handle *</Label>
                <Input
                  id="name"
                  placeholder="e.g., john_developer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profileUrl">Profile URL</Label>
                <Input
                  id="profileUrl"
                  placeholder="https://..."
                  value={formData.profileUrl}
                  onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description or notes about this account..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAccount}>Add Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>View and manage job site accounts. You can only edit accounts that you own.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts?.map((account) => {
                const typeInfo = getAccountTypeInfo(account.type)
                const statusInfo = getStatusInfo(account.status)
                const owner = isOwner(account)

                return (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{account.user.username}</div>
                          {/* <div className="text-sm text-muted-foreground">{account.user.email}</div> */}
                        </div>
                        {owner && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeInfo.icon}</span>
                        <span className="font-medium">{typeInfo.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{account.name}</span>
                        {account.meta.profileUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => window.open(account.meta.profileUrl, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </TableCell>
                    <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {account.type === "upwork" && account.meta.rating && (
                          <div>
                            ⭐ {account.meta.rating} • {account.meta.completedJobs} jobs
                          </div>
                        )}
                        {account.type === "linkedin" && account.meta.connections && (
                          <div>🤝 {account.meta.connections} connections</div>
                        )}
                        {account.type === "fiverr" && account.meta.level && (
                          <div>
                            🏆 {account.meta.level} • {account.meta.completedOrders} orders
                          </div>
                        )}
                        {account.meta.description && (
                          <div className="truncate max-w-[200px]">{account.meta.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {owner ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(account)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {account.meta.profileUrl && (
                              <DropdownMenuItem onClick={() => window.open(account.meta.profileUrl, "_blank")}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteAccount(account.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="text-sm text-muted-foreground">View only</div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {accounts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No accounts found. Add your first account to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update your account information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Username/Handle *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-profileUrl">Profile URL</Label>
              <Input
                id="edit-profileUrl"
                value={formData.profileUrl}
                onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAccount}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
