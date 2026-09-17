'use client';

import React, { useState, useEffect, useRef, useCallback, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import {
  Users,
  MessageCircle,
  UserPlus,
  UserCheck,
  Search,
  Send,
  ArrowLeft,
  Clock,
  Flame,
  Award,
  Trash2,
  Check,
  X,
  Loader2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface FriendUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  preferredLanguage?: string;
  englishLevel?: string;
  streak?: number;
  xp?: number;
  isOnline?: boolean;
  relationshipStatus?: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS';
  requestId?: string;
}

interface IncomingRequest {
  id: string;
  sender: FriendUser;
  createdAt: string;
}

interface OutgoingRequest {
  id: string;
  receiver: FriendUser;
  createdAt: string;
}

interface ConversationItem {
  id: string;
  friendId: string;
  friendName: string;
  friendEmail: string;
  friendAvatar?: string | null;
  friendLanguage?: string;
  friendLevel?: string;
  isOnline: boolean;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ChatMessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  isMine: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

// Session-based persistence helpers for instantaneous re-opening without React Compiler mutation issues
function getCachedMessages(friendId: string): ChatMessageItem[] {
  if (typeof window === 'undefined' || !friendId) return [];
  try {
    const raw = sessionStorage.getItem(`ll_msgs_${friendId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCachedMessages(friendId: string, messages: ChatMessageItem[]): void {
  if (typeof window === 'undefined' || !friendId) return;
  try {
    const slice = messages.slice(-50);
    sessionStorage.setItem(`ll_msgs_${friendId}`, JSON.stringify(slice));
  } catch {}
}

function getCachedDraft(friendId: string): string {
  if (typeof window === 'undefined' || !friendId) return '';
  try {
    return sessionStorage.getItem(`ll_draft_${friendId}`) || '';
  } catch {
    return '';
  }
}

function setCachedDraft(friendId: string, draft: string): void {
  if (typeof window === 'undefined' || !friendId) return;
  try {
    if (!draft) {
      sessionStorage.removeItem(`ll_draft_${friendId}`);
    } else {
      sessionStorage.setItem(`ll_draft_${friendId}`, draft);
    }
  } catch {}
}

function getStoredFriend(): FriendUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('ll_active_friend');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredFriend(friend: FriendUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!friend) {
      sessionStorage.removeItem('ll_active_friend');
    } else {
      sessionStorage.setItem('ll_active_friend', JSON.stringify(friend));
    }
  } catch {}
}

function getStoredFriends(): FriendUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem('ll_friends_list');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredFriends(friends: FriendUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('ll_friends_list', JSON.stringify(friends));
  } catch {}
}

function getStoredConversations(): ConversationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem('ll_convs_list');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredConversations(convs: ConversationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('ll_convs_list', JSON.stringify(convs));
  } catch {}
}

function FriendsContent() {
  const searchParams = useSearchParams();
  const directChatWith = searchParams.get('friend') || searchParams.get('chatWith');
  const directTab = searchParams.get('tab');

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    xp?: number;
    streak?: number;
    preferredLanguage?: string;
    englishLevel?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'requests' | 'search'>(
    (directTab as 'chats' | 'friends' | 'requests' | 'search') || 'chats'
  );

  // Friends & Chat State - initialized with cache for zero-latency re-opening
  const [friends, setFriends] = useState<FriendUser[]>(() => getStoredFriends());
  const [conversations, setConversations] = useState<ConversationItem[]>(() => getStoredConversations());
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingRequest[]>([]);

  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(() => {
    const stored = getStoredFriend();
    if (directChatWith) {
      if (stored?.id === directChatWith) return stored;
      const found = getStoredFriends().find((f) => f.id === directChatWith);
      if (found) return found;
    }
    return stored;
  });

  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    const friendId = directChatWith || getStoredFriend()?.id;
    if (friendId) {
      return getCachedMessages(friendId);
    }
    return [];
  });

  const [messageInput, setMessageInput] = useState<string>(() => {
    const friendId = directChatWith || getStoredFriend()?.id;
    if (friendId) {
      return getCachedDraft(friendId);
    }
    return '';
  });

  const [isSending, setIsSending] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
    friendToChat?: FriendUser;
  } | null>(null);

  // Loading & Polling States - Stale-While-Revalidate
  const [isLoadingList, setIsLoadingList] = useState<boolean>(() => {
    return getStoredFriends().length === 0 && getStoredConversations().length === 0;
  });
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [, startTransition] = useTransition();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const fetchFriendsController = useRef<AbortController | null>(null);

  // Fetch all friends with stale-response protection
  const fetchFriends = useCallback(async () => {
    if (fetchFriendsController.current) {
      fetchFriendsController.current.abort();
    }
    const controller = new AbortController();
    fetchFriendsController.current = controller;

    try {
      const res = await fetch('/api/friends', { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        // Only update if this is still the most recent request
        if (controller.signal.aborted) return;
        setFriends(data.friends || []);
        setStoredFriends(data.friends || []);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Fetch friends error:', err);
    }
  }, []);

  const fetchConversationsController = useRef<AbortController | null>(null);

  // Fetch all conversations with stale-response protection
  const fetchConversations = useCallback(async () => {
    if (fetchConversationsController.current) {
      fetchConversationsController.current.abort();
    }
    const controller = new AbortController();
    fetchConversationsController.current = controller;

    try {
      const res = await fetch('/api/chat/conversations', { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (controller.signal.aborted) return;
        setConversations(data.conversations || []);
        setStoredConversations(data.conversations || []);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Fetch conversations error:', err);
    }
  }, []);

  const fetchRequestsController = useRef<AbortController | null>(null);

  // Fetch pending requests with stale-response protection
  const fetchRequests = useCallback(async () => {
    if (fetchRequestsController.current) {
      fetchRequestsController.current.abort();
    }
    const controller = new AbortController();
    fetchRequestsController.current = controller;

    try {
      const res = await fetch('/api/friends/requests', { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (controller.signal.aborted) return;
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Fetch requests error:', err);
    }
  }, []);

  // Initial load with Stale-While-Revalidate
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        await Promise.all([fetchFriends(), fetchConversations(), fetchRequests()]);
      } finally {
        if (active) setIsLoadingList(false);
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchFriends, fetchConversations, fetchRequests]);

  // Selected friend ref and loading trackers to avoid re-render loops
  const selectedFriendRef = useRef<FriendUser | null>(null);
  const currentLoadedFriendIdRef = useRef<string | null>(null);
  const prevMessagesLengthRef = useRef(0);

  useEffect(() => {
    selectedFriendRef.current = selectedFriend;
  }, [selectedFriend]);

  // Fetch messages for a specific friend ID (zero-flicker if cached)
  const fetchMessages = useCallback(async (friendId: string, isBackground = false) => {
    if (!friendId) return;
    const hasCached = getCachedMessages(friendId).length > 0;
    if (!isBackground && !hasCached) setIsLoadingChat(true);

    try {
      const res = await fetch(`/api/chat/messages?friendId=${encodeURIComponent(friendId)}`);
      if (res.ok) {
        const data = await res.json();
        // Only update state if the user is still viewing this friend
        if (selectedFriendRef.current?.id === friendId) {
          const list: ChatMessageItem[] = data.messages || [];
          setMessages((prev) => {
            const pending = prev.filter((m) => m.status === 'sending' || m.status === 'failed');
            const serverMsgIds = new Set(list.map((m) => m.id));
            const mergedPending = pending.filter((m) => !serverMsgIds.has(m.id));
            const finalList = [...list, ...mergedPending];
            setCachedMessages(friendId, finalList);
            return finalList;
          });
          currentLoadedFriendIdRef.current = friendId;
        }
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      if (!isBackground && !hasCached) setIsLoadingChat(false);
    }
  }, []);

  // Handle direct navigation to friend chat via query param
  useEffect(() => {
    if (directChatWith) {
      const found = friends.find((f) => f.id === directChatWith) || getStoredFriends().find((f) => f.id === directChatWith);
      if (found && selectedFriendRef.current?.id !== found.id) {
        const timer = setTimeout(() => {
          setSelectedFriend(found);
          setStoredFriend(found);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [directChatWith, friends]);

  // When selectedFriend changes, fetch messages once
  useEffect(() => {
    if (!selectedFriend) {
      currentLoadedFriendIdRef.current = null;
      return;
    }

    const friendId = selectedFriend.id;
    const isCached = getCachedMessages(friendId).length > 0;
    const timer = setTimeout(() => {
      fetchMessages(friendId, isCached);
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedFriend, fetchMessages]);

  // Active chat polling with safe timeout loop
  useEffect(() => {
    if (!selectedFriend) return;
    const friendId = selectedFriend.id;
    let timerId: NodeJS.Timeout;
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;
      if (typeof document !== 'undefined' && document.visibilityState !== 'hidden') {
        await fetchMessages(friendId, true);
      }
      if (isActive) timerId = setTimeout(poll, 3000);
    };

    timerId = setTimeout(poll, 3000);

    return () => {
      isActive = false;
      clearTimeout(timerId);
    };
  }, [selectedFriend, fetchMessages]);

  // Background overview polling with safe timeout loop
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;
      if (typeof document !== 'undefined' && document.visibilityState !== 'hidden') {
        await Promise.all([fetchFriends(), fetchConversations(), fetchRequests()]).catch(() => {});
      }
      if (isActive) timerId = setTimeout(poll, 6000);
    };

    timerId = setTimeout(poll, 6000);

    return () => {
      isActive = false;
      clearTimeout(timerId);
    };
  }, [fetchFriends, fetchConversations, fetchRequests]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      if (messages.length !== prevMessagesLengthRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        prevMessagesLengthRef.current = messages.length;
      }
    } else {
      prevMessagesLengthRef.current = 0;
    }
  }, [messages.length]);

  // Handle Search with AbortController to prevent race conditions
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/friends/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.users || []);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);


  // Send Friend Request
  const handleSendRequest = async (targetUserId: string) => {
    // 1. Optimistically update UI instantly
    setSearchResults((prev) =>
      prev.map((u) =>
        u.id === targetUserId
          ? {
              ...u,
              relationshipStatus: 'PENDING_SENT',
            }
          : u
      )
    );
    setStatusMessage(null);
    setAddingUserId(targetUserId);

    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.relationshipStatus === 'FRIENDS') {
          fetchFriends();
          fetchConversations();
          setStatusMessage({ text: data.message || 'You are now friends!', type: 'success' });
          // If immediately became friends, update the search results UI again
          setSearchResults((prev) =>
            prev.map((u) =>
              u.id === targetUserId
                ? {
                    ...u,
                    relationshipStatus: 'FRIENDS',
                    requestId: data.requestId,
                  }
                : u
            )
          );
        } else {
          setStatusMessage({ text: data.message || 'Friend request sent successfully!', type: 'success' });
          // Update request id in case we want to cancel later
          setSearchResults((prev) =>
            prev.map((u) =>
              u.id === targetUserId
                ? {
                    ...u,
                    requestId: data.requestId,
                  }
                : u
            )
          );
        }
        fetchRequests();
      } else {
        // Revert optimistic UI on failure
        setSearchResults((prev) =>
          prev.map((u) =>
            u.id === targetUserId
              ? {
                  ...u,
                  relationshipStatus: 'NONE',
                }
              : u
          )
        );
        const errorMsg = data.error || data.details || 'Unable to send friend request. Please try again.';
        setStatusMessage({ text: errorMsg, type: 'error' });
      }
    } catch (err: unknown) {
      console.error('Send request error:', err);
      // Revert optimistic UI on network failure
      setSearchResults((prev) =>
        prev.map((u) =>
          u.id === targetUserId
            ? {
                ...u,
                relationshipStatus: 'NONE',
              }
            : u
        )
      );
      setStatusMessage({ text: 'Unable to send friend request. Please check your connection and try again.', type: 'error' });
    } finally {
      setAddingUserId(null);
    }
  };

  // Respond to Friend Request (ACCEPT or DECLINE)
  const handleRespondRequest = async (
    requestId: string,
    action: 'ACCEPT' | 'DECLINE',
    sender?: { id: string; name?: string; email?: string }
  ) => {
    if (respondingRequestId) return;
    setRespondingRequestId(requestId);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/friends/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          senderId: sender?.id,
          senderName: sender?.name,
          senderEmail: sender?.email,
          action,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setIncomingRequests((prev) =>
          prev.filter((r) => r.id !== requestId && (!sender || r.sender.id !== sender.id))
        );

        if (action === 'ACCEPT' && data.friend) {
          const newFriend: FriendUser = data.friend;
          const newConv: ConversationItem = data.conversation;

          setFriends((prev) => {
            const next = [newFriend, ...prev.filter((f) => f.id !== newFriend.id)];
            setStoredFriends(next);
            return next;
          });

          if (newConv) {
            setConversations((prev) => {
              const next = [newConv, ...prev.filter((c) => c.friendId !== newConv.friendId)];
              setStoredConversations(next);
              return next;
            });
          }

          setSearchResults((prev) =>
            prev.map((u) => (u.id === newFriend.id ? { ...u, relationshipStatus: 'FRIENDS' as const } : u))
          );

          setStatusMessage({
            text: data.message || `You are now friends with ${newFriend.name}!`,
            type: 'success',
            friendToChat: newFriend,
          });
        } else {
          setStatusMessage({
            text: data.message || (action === 'ACCEPT' ? 'Friend request accepted!' : 'Friend request declined.'),
            type: 'success',
          });
        }
        
        // Ensure subsequent background fetches are aborted to prevent stale overwrites
        fetchFriends();
        fetchConversations();
        fetchRequests();

      } else {
        setStatusMessage({
          text: data.error || 'Failed to process request.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Respond request error:', err);
      setStatusMessage({
        text: 'Unable to process request. Please check your connection.',
        type: 'error',
      });
    } finally {
      setRespondingRequestId(null);
    }
  };

  // Remove Friend
  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    if (!confirm(`Are you sure you want to remove ${friendName} from your friends?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/friends/${friendId}`, { method: 'DELETE' });
      if (res.ok) {
        setFriends((prev) => {
          const next = prev.filter((f) => f.id !== friendId);
          setStoredFriends(next);
          return next;
        });
        setConversations((prev) => {
          const next = prev.filter((c) => c.friendId !== friendId);
          setStoredConversations(next);
          return next;
        });
        if (selectedFriend?.id === friendId) {
          handleCloseChat();
        }
        
        fetchFriends();
        fetchConversations();
        fetchRequests();
      }
    } catch (err) {
      console.error('Remove friend error:', err);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedFriend || isSending) return;

    const content = messageInput.trim();
    if (!content) return;

    const friendId = selectedFriend.id;
    // Optimistic message update for zero latency
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessageItem = {
      id: tempId,
      senderId: user?.id || 'me',
      receiverId: friendId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      isMine: true,
      status: 'sending',
    };

    setMessages((prev) => {
      const updated = [...prev, optimisticMsg];
      setCachedMessages(friendId, updated);
      return updated;
    });
    setMessageInput('');
    setCachedDraft(friendId, '');
    setIsSending(true);

    // Update conversation item in sidebar optimistically
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.friendId === friendId
          ? {
              ...c,
              lastMessageText: content.slice(0, 100),
              lastMessageAt: new Date().toISOString(),
            }
          : c
      );
      setStoredConversations(updated);
      return updated;
    });

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: friendId,
          content,
          clientMessageId: tempId, // Idempotency key
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        // Replace optimistic msg with real message
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === tempId ? { ...data.message, isMine: true, status: 'sent' as const } : m
          );
          setCachedMessages(friendId, updated);
          return updated;
        });
      } else {
        // Mark optimistic message as failed rather than deleting it
        setMessages((prev) => {
          const updated = prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' as const } : m));
          setCachedMessages(friendId, updated);
          return updated;
        });
        setStatusMessage({
          text: data.error || 'Failed to send message.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages((prev) => {
        const updated = prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' as const } : m));
        setCachedMessages(friendId, updated);
        return updated;
      });
      setStatusMessage({
        text: 'Network error: could not deliver message. Tap Retry to resend.',
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Retry sending a failed message
  const handleRetryMessage = async (failedId: string, content: string) => {
    if (!selectedFriend) return;
    const friendId = selectedFriend.id;

    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === failedId ? { ...m, status: 'sending' as const } : m));
      setCachedMessages(friendId, updated);
      return updated;
    });

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: friendId,
          content,
          clientMessageId: failedId, // Keep same idempotency key
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === failedId ? { ...data.message, isMine: true, status: 'sent' as const } : m
          );
          setCachedMessages(friendId, updated);
          return updated;
        });
      } else {
        setMessages((prev) => {
          const updated = prev.map((m) => (m.id === failedId ? { ...m, status: 'failed' as const } : m));
          setCachedMessages(friendId, updated);
          return updated;
        });
        setStatusMessage({
          text: data.error || 'Failed to retry message.',
          type: 'error',
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = prev.map((m) => (m.id === failedId ? { ...m, status: 'failed' as const } : m));
        setCachedMessages(friendId, updated);
        return updated;
      });
    }
  };

  // Open Chat with a friend (preserves draft of previous conversation)
  const openChatWithFriend = (friend: FriendUser) => {
    if (selectedFriendRef.current) {
      setCachedDraft(selectedFriendRef.current.id, messageInput);
    }

    const cachedMsgs = getCachedMessages(friend.id);
    setMessages(cachedMsgs);
    setMessageInput(getCachedDraft(friend.id));
    setStoredFriend(friend);

    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', `/friends?friend=${encodeURIComponent(friend.id)}`);
      } catch {}
    }

    startTransition(() => {
      setSelectedFriend(friend);
    });
  };

  // Close Chat (intentionally navigating back to conversations list)
  const handleCloseChat = () => {
    if (selectedFriendRef.current) {
      setCachedDraft(selectedFriendRef.current.id, messageInput);
    }
    setSelectedFriend(null);
    setStoredFriend(null);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', '/friends');
      } catch {}
    }
  };

  const pendingRequestsCount = incomingRequests.length;
  const totalUnreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <AppShell
      user={
        user || {
          id: 'guest',
          name: 'Learner',
          email: '',
          preferredLanguage: 'Malayalam',
        }
      }
    >
      <div className="max-w-6xl mx-auto h-[calc(100vh-130px)] min-h-[550px] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden select-none">
        {/* Top Header & Mobile Breadcrumb */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {selectedFriend ? (
              <button
                type="button"
                onClick={handleCloseChat}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Back to conversation list"
              >
                <ArrowLeft className="w-5 h-5 select-none pointer-events-none" aria-hidden="true" />
              </button>
            ) : null}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Users className="w-5 h-5 select-none pointer-events-none" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Friends & Classmates
                </h1>
                <p className="text-xs text-slate-500">
                  Connect with fellow learners and practice English together
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchFriends();
                fetchConversations();
                fetchRequests();
                if (selectedFriend) fetchMessages(selectedFriend.id, false);
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Navigation Tabs & Lists */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 ${
              selectedFriend ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Tabs Header */}
            <div className="p-3 border-b border-slate-200 bg-white grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 relative cursor-pointer ${
                  activeTab === 'chats'
                    ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <MessageCircle className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                <span>Chats</span>
                {totalUnreadCount > 0 && (
                  <span className="absolute top-1 right-2 bg-indigo-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalUnreadCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('friends')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'friends'
                    ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                <span>Friends</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 relative cursor-pointer ${
                  activeTab === 'requests'
                    ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                <span>Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="absolute top-1 right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'search'
                    ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <UserPlus className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                <span>Find</span>
              </button>
            </div>

            {/* List Body based on activeTab */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingList ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-11 h-11 rounded-2xl bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* TAB 1: CHATS / RECENT CONVERSATIONS */}
                  {activeTab === 'chats' && (
                    <div className="divide-y divide-slate-100">
                      {conversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 select-none pointer-events-none" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-700">No conversations yet</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Connect with friends and start chatting to practice speaking English!
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab('search')}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Find Classmates</span>
                          </button>
                        </div>
                      ) : (
                        conversations.map((conv) => {
                          const isSelected = selectedFriend?.id === conv.friendId;
                          return (
                            <button
                              key={conv.id}
                              type="button"
                              onClick={() => {
                                openChatWithFriend({
                                  id: conv.friendId,
                                  name: conv.friendName,
                                  email: conv.friendEmail,
                                  avatar: conv.friendAvatar,
                                  preferredLanguage: conv.friendLanguage,
                                  englishLevel: conv.friendLevel,
                                  isOnline: conv.isOnline,
                                });
                              }}
                              className={`w-full p-3.5 text-left flex items-start gap-3 transition-all duration-200 cursor-pointer select-none group ${
                                isSelected
                                  ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                                  : 'hover:bg-slate-50 border-l-4 border-transparent'
                              }`}
                            >
                              {/* Avatar */}
                              <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-white">
                                  {conv.friendName.charAt(0).toUpperCase()}
                                </div>
                                {conv.isOnline && (
                                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-sm text-slate-900 truncate">
                                    {conv.friendName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 shrink-0">
                                    {conv.lastMessageAt
                                      ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })
                                      : ''}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                                  {conv.lastMessageText}
                                </p>
                              </div>

                              {/* Unread Badge */}
                              {conv.unreadCount > 0 && (
                                <span className="shrink-0 bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-5 text-center">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* TAB 2: MY FRIENDS */}
                  {activeTab === 'friends' && (
                    <div className="divide-y divide-slate-100">
                      {friends.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
                            <Users className="w-6 h-6 select-none pointer-events-none" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-700">No friends added yet</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Search for your classmates and send them a friend request!
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab('search')}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Find Classmates</span>
                          </button>
                        </div>
                      ) : (
                        friends.map((friend) => (
                          <div
                            key={friend.id}
                            className="p-3.5 hover:bg-white transition-colors flex items-center justify-between gap-3 select-none"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                  {friend.name.charAt(0).toUpperCase()}
                                </div>
                                {friend.isOnline && (
                                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-sm text-slate-900 truncate">
                                    {friend.name}
                                  </span>
                                  {friend.streak ? (
                                    <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" aria-hidden="true" />
                                      {friend.streak}
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {friend.preferredLanguage} • {friend.englishLevel?.replace('_', ' ')}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => openChatWithFriend(friend)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Message</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveFriend(friend.id, friend.name)}
                                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="Remove friend"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 3: FRIEND REQUESTS */}
                  {activeTab === 'requests' && (
                    <div className="p-3 space-y-5">
                      {/* Status Feedback Banner */}
                      {statusMessage && (
                        <div
                          className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                            statusMessage.type === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs'
                          }`}
                        >
                          <span className="flex-1 mr-2">{statusMessage.text}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {statusMessage.friendToChat && (
                              <button
                                type="button"
                                onClick={() => {
                                  openChatWithFriend(statusMessage.friendToChat!);
                                  setStatusMessage(null);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" aria-hidden="true" />
                                <span>Chat</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setStatusMessage(null)}
                              className="p-1 hover:opacity-75 text-xs cursor-pointer text-slate-500"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Incoming Requests */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                            Received Requests ({incomingRequests.length})
                          </span>
                        </div>

                        {incomingRequests.length === 0 ? (
                          <div className="p-5 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-400">
                            You don&apos;t have any pending friend requests.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {incomingRequests.map((req) => (
                              <div
                                key={req.id}
                                className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 select-none"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {req.sender.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-bold text-sm text-slate-900 block truncate">
                                      {req.sender.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400 block truncate">
                                      {req.sender.preferredLanguage} learner
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    disabled={respondingRequestId === req.id}
                                    onClick={() => handleRespondRequest(req.id, 'ACCEPT', req.sender)}
                                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    {respondingRequestId === req.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                    )}
                                    <span>{respondingRequestId === req.id ? 'Accepting...' : 'Accept'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={respondingRequestId === req.id}
                                    onClick={() => handleRespondRequest(req.id, 'DECLINE', req.sender)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Decline</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Outgoing Requests */}
                      {outgoingRequests.length > 0 && (
                        <div>
                          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block mb-2.5">
                            Sent Requests ({outgoingRequests.length})
                          </span>
                          <div className="space-y-2">
                            {outgoingRequests.map((req) => (
                              <div
                                key={req.id}
                                className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs select-none"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                    {req.receiver.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-slate-800 truncate">
                                    {req.receiver.name}
                                  </span>
                                </div>
                                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] rounded-full shrink-0">
                                  Pending
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: FIND FRIENDS (SEARCH) */}
                  {activeTab === 'search' && (
                    <div className="p-3 space-y-3">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 select-none pointer-events-none" aria-hidden="true" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (!e.target.value.trim()) {
                              setSearchResults([]);
                              setIsSearching(false);
                            }
                          }}
                          placeholder="Search learners by name or email..."
                          className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResults([]);
                              setIsSearching(false);
                            }}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      {/* Status Feedback Banner */}
                      {statusMessage && (
                        <div
                          className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                            statusMessage.type === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs'
                          }`}
                        >
                          <span className="flex-1 mr-2">{statusMessage.text}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {statusMessage.friendToChat && (
                              <button
                                type="button"
                                onClick={() => {
                                  openChatWithFriend(statusMessage.friendToChat!);
                                  setStatusMessage(null);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" aria-hidden="true" />
                                <span>Chat</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setStatusMessage(null)}
                              className="p-1 hover:opacity-75 text-xs cursor-pointer text-slate-500"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Results List */}
                      {isSearching ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 animate-pulse">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                                <div className="space-y-1.5">
                                  <div className="w-24 h-3 bg-slate-200 rounded" />
                                  <div className="w-32 h-2 bg-slate-100 rounded" />
                                </div>
                              </div>
                              <div className="w-16 h-7 bg-slate-200 rounded-xl" />
                            </div>
                          ))}
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((userResult) => (
                            <div
                              key={userResult.id}
                              className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs select-none"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                  {userResult.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-xs text-slate-900 block truncate">
                                    {userResult.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    {userResult.preferredLanguage} • {userResult.englishLevel?.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {userResult.relationshipStatus === 'FRIENDS' ? (
                                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                                    <Check className="w-3 h-3" aria-hidden="true" />
                                    <span>Friends</span>
                                  </span>
                                ) : userResult.relationshipStatus === 'PENDING_SENT' ? (
                                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] rounded-full">
                                    Request Sent
                                  </span>
                                ) : userResult.relationshipStatus === 'PENDING_RECEIVED' ? (
                                  <button
                                    type="button"
                                    disabled={respondingRequestId === (userResult.requestId || userResult.id)}
                                    onClick={() =>
                                      handleRespondRequest(
                                        userResult.requestId || userResult.id,
                                        'ACCEPT',
                                        userResult
                                      )
                                    }
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[10px] rounded-full shadow-xs cursor-pointer inline-flex items-center gap-1"
                                  >
                                    {respondingRequestId === (userResult.requestId || userResult.id) ? (
                                      <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                                    ) : (
                                      <Check className="w-3 h-3" aria-hidden="true" />
                                    )}
                                    <span>{respondingRequestId === (userResult.requestId || userResult.id) ? 'Accepting...' : 'Accept'}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={addingUserId === userResult.id}
                                    onClick={() => handleSendRequest(userResult.id)}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                  >
                                    {addingUserId === userResult.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                                    ) : (
                                      <UserPlus className="w-3 h-3" aria-hidden="true" />
                                    )}
                                    <span>{addingUserId === userResult.id ? 'Adding...' : 'Add'}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : searchQuery.trim() ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No learners found matching &ldquo;{searchQuery}&rdquo;.
                        </div>
                      ) : (
                        <div className="p-6 text-center text-slate-400 text-xs space-y-1">
                          <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-2" aria-hidden="true" />
                          <p className="font-semibold text-slate-600">Search for Classmates</p>
                          <p className="text-[11px]">Type a name or email to connect with other English learners.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Panel: 1-to-1 Private Chat Window */}
          <div
            className={`flex-1 flex flex-col bg-white overflow-hidden ${
              selectedFriend ? 'flex' : 'hidden md:flex'
            }`}
          >
            {selectedFriend ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Chat Top Header */}
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCloseChat}
                      className="md:hidden p-1.5 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Back to conversations"
                    >
                      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        {selectedFriend.name.charAt(0).toUpperCase()}
                      </div>
                      {selectedFriend.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-sm text-slate-900">
                          {selectedFriend.name}
                        </h2>
                        {selectedFriend.isOnline ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            Online
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Active recently
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {selectedFriend.preferredLanguage} speaker • Practice English together
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedFriend.streak ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl hidden sm:inline-flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" aria-hidden="true" />
                        <span>{selectedFriend.streak}d streak</span>
                      </span>
                    ) : null}
                    {selectedFriend.xp ? (
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl hidden sm:inline-flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                        <span>{selectedFriend.xp} XP</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Message Stream */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/60"
                >
                  {isLoadingChat ? (
                    <div className="h-full flex flex-col justify-end p-4 space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'}`}>
                          <div className={`w-48 h-10 rounded-2xl animate-pulse ${i % 2 === 0 ? 'bg-slate-200 rounded-tl-none' : 'bg-indigo-100 rounded-tr-none'}`} />
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 select-none pointer-events-none" aria-hidden="true" />
                      </div>
                      <p className="font-bold text-sm text-slate-700">
                        Start chatting with {selectedFriend.name}!
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Say hello, ask what they did today, or practice an English sentence together.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.isMine;
                      const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      const isFailed = msg.status === 'failed';
                      const isSendingStatus = msg.status === 'sending';

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs break-words whitespace-pre-wrap select-text ${
                              isMine
                                ? isFailed
                                  ? 'bg-rose-600 text-white rounded-tr-none'
                                  : isSendingStatus
                                  ? 'bg-indigo-500 text-white/90 rounded-tr-none'
                                  : 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
                            <span>{timeStr}</span>
                            {isMine && (
                              <>
                                {isSendingStatus ? (
                                  <Clock className="w-3 h-3 animate-pulse text-indigo-400" aria-label="Sending" />
                                ) : isFailed ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRetryMessage(msg.id, msg.content)}
                                    className="text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                                    title="Click to retry"
                                  >
                                    <span>Failed • Retry</span>
                                  </button>
                                ) : (
                                  <span className="text-indigo-600 font-bold">
                                    {msg.isRead ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all"
                  >
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMessageInput(val);
                        if (selectedFriend) {
                          setCachedDraft(selectedFriend.id, val);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Message ${selectedFriend.name}...`}
                      className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                    />

                    <button
                      type="submit"
                      disabled={isSending || !messageInput.trim()}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-40 cursor-pointer shrink-0"
                      title="Send message"
                    >
                      <Send className="w-4 h-4 select-none pointer-events-none" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* No Friend Selected: Welcoming Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Users className="w-8 h-8 select-none pointer-events-none" aria-hidden="true" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h3 className="font-extrabold text-base text-slate-800">
                    Private 1-to-1 English Practice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select a friend from your list or find new classmates to practice daily conversation!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  <span>Find Classmates</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" aria-hidden="true" />
          <span>Loading Friends...</span>
        </div>
      }
    >
      <FriendsContent />
    </Suspense>
  );
}
