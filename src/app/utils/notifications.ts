import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

let initialized = false;

async function ensureInit() {
  if (initialized) return;
  initialized = true;
  try {
    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      await LocalNotifications.requestPermissions();
    }
  } catch {}
}

let nextId = 1;

export async function sendLocalNotification(title: string, body: string) {
  try {
    await ensureInit();
    if (!Capacitor.isPluginAvailable('LocalNotifications')) return;
    await LocalNotifications.schedule({
      notifications: [{ title, body, id: nextId++ }]
    });
  } catch {}
}

export function sendLikeNotification(userName: string) {
  return sendLocalNotification('新点赞', `${userName}赞了你的帖子`);
}

export function sendCommentNotification(userName: string, content: string) {
  const preview = content.length > 30 ? content.slice(0, 30) + '...' : content;
  return sendLocalNotification('新评论', `${userName}评论了你的帖子：${preview}`);
}

export function sendFollowNotification(userName: string) {
  return sendLocalNotification('新关注', `${userName}关注了你`);
}

export function sendNewNotification(text: string) {
  return sendLocalNotification('新通知', text);
}
