import nodemailer from 'nodemailer'
import { randomBytes } from 'crypto'

export interface EmailConfig {
  from: string
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  })
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function generateTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
}

export function generateShortTokenExpiry(): Date {
  return new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
}

export async function sendVerificationEmail(
  transporter: nodemailer.Transporter,
  to: string,
  token: string,
  baseUrl: string
) {
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'S8L 帳號驗證',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #374151;">驗證您的 S8L 帳號</h2>
        <p>感謝您註冊 S8L 短網址服務！</p>
        <p>請點擊下方按鈕驗證您的電子郵件地址：</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #1f2937; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 8px; display: inline-block;">
            驗證電子郵件
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          如果按鈕無法點擊，請複製以下連結到瀏覽器：<br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          此連結將在 24 小時後失效。如果您沒有註冊 S8L 帳號，請忽略此郵件。
        </p>
      </div>
    `
  }
  
  return transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(
  transporter: nodemailer.Transporter,
  to: string,
  token: string,
  baseUrl: string
) {
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'S8L 密碼重設',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #374151;">重設您的密碼</h2>
        <p>我們收到您的密碼重設請求。</p>
        <p>請點擊下方按鈕重設您的密碼：</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #1f2937; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 8px; display: inline-block;">
            重設密碼
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          如果按鈕無法點擊，請複製以下連結到瀏覽器：<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          此連結將在 15 分鐘後失效。如果您沒有請求重設密碼，請忽略此郵件。
        </p>
      </div>
    `
  }
  
  return transporter.sendMail(mailOptions)
}

export function getEmailConfig(): EmailConfig {
  return {
    from: process.env.EMAIL_FROM!,
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  }
}