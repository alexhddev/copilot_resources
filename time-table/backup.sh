#!/bin/bash

# Simple backup management script
set -euo pipefail

BACKUP_DIR="/tmp/backups"
SOURCE_DIR="$HOME/Documents"
LOG_FILE="/tmp/backup.log"
MAX_BACKUPS=5

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to create backup
create_backup() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_name="backup_$timestamp.tar.gz"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_message "Starting backup of $SOURCE_DIR"
    
    if tar -czf "$backup_path" -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")" 2>/dev/null; then
        log_message "Backup created successfully: $backup_name"
        echo "$backup_path"
    else
        log_message "ERROR: Backup failed"
        return 1
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    local backup_count=$(ls -1 "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | wc -l)
    
    if [ "$backup_count" -gt "$MAX_BACKUPS" ]; then
        log_message "Cleaning up old backups (keeping $MAX_BACKUPS)"
        ls -1t "$BACKUP_DIR"/backup_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
    fi
}

# Main execution
case "${1:-backup}" in
    "backup")
        if create_backup; then
            cleanup_old_backups
            log_message "Backup process completed"
        fi
        ;;
    "list")
        echo "Available backups:"
        ls -lht "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null || echo "No backups found"
        ;;
    "restore")
        echo "Available backups for restore:"
        select backup in "$BACKUP_DIR"/backup_*.tar.gz; do
            if [ -n "$backup" ]; then
                tar -xzf "$backup" -C /tmp/
                log_message "Restored backup: $(basename "$backup")"
                break
            fi
        done
        ;;
    *)
        echo "Usage: $0 {backup|list|restore}"
        exit 1
        ;;
esac