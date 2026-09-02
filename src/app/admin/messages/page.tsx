"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./messages.module.css";
import { db } from "@/lib/firebase";
import { 
    collection, 
    onSnapshot, 
    query, 
    orderBy, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "firebase/firestore";
import { 
    Mail, 
    MailOpen, 
    Search, 
    Trash2, 
    Loader2, 
    Inbox, 
    ArrowLeft, 
    CheckCircle, 
    MessageSquare,
    Calendar,
    User,
    Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactMessage {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt?: any;
    read: boolean;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
    const [isDeleting, setIsDeleting] = useState(false);

    // Mobile detail view toggle
    const [showDetailMobile, setShowDetailMobile] = useState(false);

    useEffect(() => {
        setLoading(true);

        const messagesQuery = query(
            collection(db, "messages"), 
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ContactMessage));
            setMessages(data);
            setLoading(false);
        }, (error) => {
            console.error("Erreur Firestore messages :", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter messages based on search and status
    const filteredMessages = useMemo(() => {
        return messages.filter((msg) => {
            const nameLower = msg.name.toLowerCase();
            const emailLower = msg.email ? msg.email.toLowerCase() : "";
            const phoneLower = msg.phone ? msg.phone.toLowerCase() : "";
            const subjectLower = msg.subject.toLowerCase();
            const messageLower = msg.message.toLowerCase();
            const queryLower = searchQuery.toLowerCase();

            const matchesSearch = 
                nameLower.includes(queryLower) ||
                emailLower.includes(queryLower) ||
                phoneLower.includes(queryLower) ||
                subjectLower.includes(queryLower) ||
                messageLower.includes(queryLower);

            const matchesStatus = 
                statusFilter === "all" ||
                (statusFilter === "unread" && !msg.read) ||
                (statusFilter === "read" && msg.read);

            return matchesSearch && matchesStatus;
        });
    }, [messages, searchQuery, statusFilter]);

    // Get selected message details
    const selectedMessage = useMemo(() => {
        return messages.find((msg) => msg.id === selectedId) || null;
    }, [messages, selectedId]);

    // Handle select message
    const handleSelectMessage = async (msg: ContactMessage) => {
        setSelectedId(msg.id);
        setShowDetailMobile(true);

        // Mark as read automatically if unread
        if (!msg.read) {
            try {
                const docRef = doc(db, "messages", msg.id);
                await updateDoc(docRef, { read: true });
            } catch (err) {
                console.error("Erreur lors de la mise à jour du statut lu :", err);
            }
        }
    };

    // Toggle read/unread status manually
    const handleToggleRead = async (msg: ContactMessage) => {
        try {
            const docRef = doc(db, "messages", msg.id);
            await updateDoc(docRef, { read: !msg.read });
        } catch (err) {
            console.error("Erreur lors du changement de statut :", err);
        }
    };

    // Delete message
    const handleDeleteMessage = async (msg: ContactMessage) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce message ?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const docRef = doc(db, "messages", msg.id);
            await deleteDoc(docRef);
            
            // Clear selection if deleted item was selected
            if (selectedId === msg.id) {
                setSelectedId(null);
                setShowDetailMobile(false);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression du message :", err);
            alert("Une erreur est survenue lors de la suppression.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Format date in Africa/Dakar timezone
    const formatDate = (createdAt: any) => {
        if (!createdAt) return "Date inconnue";
        try {
            const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
            return date.toLocaleString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Africa/Dakar"
            });
        } catch (e) {
            return "Format date invalide";
        }
    };

    // Unread count
    const unreadCount = useMemo(() => {
        return messages.filter(m => !m.read).length;
    }, [messages]);

    return (
        <div className={styles.messagesPage}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Messages de Contact</h1>
                    <p>
                        {unreadCount > 0 
                            ? `${unreadCount} message(s) non lu(s) sur un total de ${messages.length}`
                            : `${messages.length} message(s) au total`
                        }
                    </p>
                </div>
            </header>

            <div className={styles.actionBar}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom, téléphone, sujet..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                    <option value="all">Tous les messages</option>
                    <option value="unread">Non lus</option>
                    <option value="read">Lus</option>
                </select>
            </div>

            <div className={styles.layoutContainer}>
                {/* Left Panel: Message List */}
                <div className={`${styles.listPanel} ${showDetailMobile ? styles.mobileHideList : ""}`}>
                    <div className={styles.listScroll}>
                        {loading ? (
                            <div style={{ padding: "4rem", textAlign: "center" }}>
                                <Loader2 className="animate-spin" size={36} style={{ color: "var(--primary-green)", margin: "0 auto" }} />
                                <p style={{ marginTop: "1rem", color: "#666" }}>Chargement des messages...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Inbox size={48} />
                                <p>Aucun message correspondant.</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => {
                                const isSelected = selectedId === msg.id;
                                return (
                                    <div 
                                        key={msg.id}
                                        onClick={() => handleSelectMessage(msg)}
                                        className={`${styles.messageItem} ${isSelected ? styles.activeItem : ""}`}
                                    >
                                        {!msg.read && <div className={styles.unreadIndicator} />}
                                        <div className={styles.itemContent}>
                                            <div className={styles.itemHeader}>
                                                <span className={styles.senderName}>{msg.name}</span>
                                                <span className={styles.messageDate}>
                                                    {msg.createdAt?.toDate 
                                                        ? msg.createdAt.toDate().toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Africa/Dakar" })
                                                        : "Récemment"
                                                    }
                                                </span>
                                            </div>
                                            <div className={styles.itemSubject}>{msg.subject}</div>
                                            <div className={styles.itemSnippet}>{msg.message}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Detail View */}
                <div className={`${styles.detailPanel} ${!showDetailMobile ? styles.mobileHideList : styles.mobileShowDetail}`}>
                    {showDetailMobile && (
                        <button 
                            className={styles.backBtn}
                            onClick={() => setShowDetailMobile(false)}
                        >
                            <ArrowLeft size={18} /> Retour à la liste
                        </button>
                    )}

                    {selectedMessage ? (
                        <div>
                            <div className={styles.detailHeader}>
                                <h2 className={styles.detailSubject}>{selectedMessage.subject}</h2>
                                <div className={styles.metaRow}>
                                    <div className={styles.metaInfo}>
                                        <div className={styles.avatar}>
                                            {selectedMessage.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.senderDetails}>
                                            <span className={styles.senderFull}>{selectedMessage.name}</span>
                                            {selectedMessage.phone ? (
                                                <a href={`tel:${selectedMessage.phone}`} className={styles.senderEmail}>
                                                    <Phone size={14} /> {selectedMessage.phone}
                                                </a>
                                            ) : selectedMessage.email ? (
                                                <a href={`mailto:${selectedMessage.email}`} className={styles.senderEmail}>
                                                    <Mail size={14} /> {selectedMessage.email}
                                                </a>
                                            ) : (
                                                <span className={styles.senderEmail}>Aucun contact</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.actionRow}>
                                        <button 
                                            onClick={() => handleToggleRead(selectedMessage)}
                                            className={`${styles.actionIconBtn} ${selectedMessage.read ? styles.actionIconBtnActive : ""}`}
                                            title={selectedMessage.read ? "Marquer comme non lu" : "Marquer comme lu"}
                                        >
                                            {selectedMessage.read ? <MailOpen size={18} /> : <Mail size={18} />}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteMessage(selectedMessage)}
                                            className={`${styles.actionIconBtn} ${styles.deleteBtn}`}
                                            disabled={isDeleting}
                                            title="Supprimer définitivement"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Calendar size={14} /> {formatDate(selectedMessage.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.messageContent}>
                                {selectedMessage.message}
                            </div>

                             <div className={styles.replyArea}>
                                {selectedMessage.phone ? (
                                    <>
                                        <a 
                                            href={`tel:${selectedMessage.phone}`}
                                            className={styles.replyBtn}
                                            style={{ marginRight: "10px", background: "var(--primary-orange)", boxShadow: "0 4px 12px rgba(230, 81, 0, 0.2)" }}
                                        >
                                            <Phone size={18} /> Appeler
                                        </a>
                                        <a 
                                            href={`https://wa.me/${(() => {
                                                let cleaned = selectedMessage.phone.replace(/\D/g, "");
                                                if (cleaned.startsWith("00")) cleaned = cleaned.substring(2);
                                                if (cleaned.length === 9 && (cleaned.startsWith("77") || cleaned.startsWith("78") || cleaned.startsWith("76") || cleaned.startsWith("70") || cleaned.startsWith("75"))) {
                                                    cleaned = "221" + cleaned;
                                                }
                                                return cleaned;
                                            })()}?text=Bonjour%20${encodeURIComponent(selectedMessage.name)},%20concernant%20votre%20message%20"${encodeURIComponent(selectedMessage.subject)}"%20:%20`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.replyBtn}
                                            style={{ background: "#25D366", boxShadow: "0 4px 12px rgba(37, 211, 102, 0.2)" }}
                                        >
                                            <MessageSquare size={18} /> WhatsApp
                                        </a>
                                    </>
                                ) : selectedMessage.email ? (
                                    <a 
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                                        className={styles.replyBtn}
                                    >
                                        <Mail size={18} /> Répondre par Email
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.detailPlaceholder}>
                            <Mail size={48} />
                            <p>Sélectionnez un message dans la liste pour afficher ses détails.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
