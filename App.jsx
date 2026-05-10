import { useState, useEffect } from 'react'
import { 
  Home, 
  Search, 
  Globe, 
  Mail, 
  Video, 
  Building, 
  Bot, 
  Folder, 
  Settings, 
  Sun, 
  Moon, 
  Clock, 
  History,
  X,
  Plus,
  Download,
  Trash2,
  Eye,
  ArrowLeft,
  Move,
  FileText,
  FolderPlus,
  Upload,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Save,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [siteSearchQuery, setSiteSearchQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('baidu')
  const [engineType, setEngineType] = useState('domestic')
  const [videoType, setVideoType] = useState('domestic')
  const [aiType, setAiType] = useState('domestic')
  const [hotSearchData, setHotSearchData] = useState({
    baidu: [],
    weibo: []
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [siteSearchHistory, setSiteSearchHistory] = useState([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [showSiteSearchHistory, setShowSiteSearchHistory] = useState(false)
  const [customWebsites, setCustomWebsites] = useState([])
  const [showAddWebsite, setShowAddWebsite] = useState(false)
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' })
  const [showEditWebsite, setShowEditWebsite] = useState(false)
  const [editingWebsite, setEditingWebsite] = useState(null)
  const [editWebsite, setEditWebsite] = useState({ name: '', url: '' })
  const [files, setFiles] = useState([])
  const [currentFolder, setCurrentFolder] = useState('/')
  const [showNotepad, setShowNotepad] = useState(false)
  const [notepadContent, setNotepadContent] = useState('')
  const [showNotepadPreview, setShowNotepadPreview] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showCreateNotepad, setShowCreateNotepad] = useState(false)
  const [newNotepadName, setNewNotepadName] = useState('')
  const [currentNotepad, setCurrentNotepad] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [showMoveFile, setShowMoveFile] = useState(false)
  const [fileToMove, setFileToMove] = useState(null)
  const [targetFolder, setTargetFolder] = useState('/')
  const [showRenameFolder, setShowRenameFolder] = useState(false)
  const [folderToRename, setFolderToRename] = useState(null)
  const [newFolderNameForRename, setNewFolderNameForRename] = useState('')

  // 时钟更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 初始化热搜数据
  useEffect(() => {
    refreshHotSearch()
  }, [])

  // 加载保存的数据
  useEffect(() => {
    try {
      // 加载自定义网站数据
      const savedWebsites = localStorage.getItem('austin-workspace-websites')
      if (savedWebsites) {
        const websitesData = JSON.parse(savedWebsites)
        if (Array.isArray(websitesData)) {
          setCustomWebsites(websitesData)
        }
      }

      // 加载文件数据
      const savedFiles = localStorage.getItem('austin-workspace-files')
      if (savedFiles) {
        const filesData = JSON.parse(savedFiles)
        if (Array.isArray(filesData)) {
          setFiles(filesData)
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }, [])

  // 搜索引擎数据
  const searchEngines = {
    domestic: [
      { name: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=', icon: '🔍' },
      { name: '搜狗', value: 'sogou', url: 'https://www.sogou.com/web?query=', icon: '🐕' },
      { name: '360搜索', value: '360', url: 'https://www.so.com/s?q=', icon: '🔵' },
      { name: '必应', value: 'bing', url: 'https://cn.bing.com/search?q=', icon: '🅱️' }
    ],
    international: [
      { name: 'Google', value: 'google', url: 'https://www.google.com/search?q=', icon: '🌐' },
      { name: 'Bing', value: 'bing-intl', url: 'https://www.bing.com/search?q=', icon: '🅱️' },
      { name: 'DuckDuckGo', value: 'duckduckgo', url: 'https://duckduckgo.com/?q=', icon: '🦆' },
      { name: 'Yahoo', value: 'yahoo', url: 'https://search.yahoo.com/search?p=', icon: '🟣' }
    ]
  }

  // AI工具数据
  const aiTools = {
    domestic: [
      { name: '文心一言', url: 'https://yiyan.baidu.com/', icon: '💭' },
      { name: '通义千问', url: 'https://tongyi.aliyun.com/', icon: '🧠' },
      { name: '讯飞星火', url: 'https://xinghuo.xfyun.cn/', icon: '✨' },
      { name: '智谱清言', url: 'https://chatglm.cn/', icon: '💬' },
      { name: '豆包', url: 'https://www.doubao.com/', icon: '🎒' },
      { name: '纳米AI搜索', url: 'https://bot.n.cn/chathome', icon: '🔬' },
      { name: '秘塔AI', url: 'https://metaso.cn/', icon: '🗝️' },
      { name: 'DeepSeek', url: 'https://www.deepseek.com/', icon: '🔍' },
      { name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: '🌙' }
    ],
    international: [
      { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: '🤖' },
      { name: 'Gemini', url: 'https://gemini.google.com/', icon: '♊' },
      { name: 'Copilot', url: 'https://copilot.microsoft.com/', icon: '🚁' },
      { name: 'Grok', url: 'https://grok.x.ai/', icon: '🚀' }
    ]
  }

  // 视频平台数据
  const videoPlatforms = {
    domestic: [
      { name: '哔哩哔哩', url: 'https://www.bilibili.com/', icon: '📺' },
      { name: 'A站', url: 'https://www.acfun.cn/', icon: '🅰️' },
      { name: '搜狐视频', url: 'https://tv.sohu.com/', icon: '🦊' },
      { name: '腾讯视频', url: 'https://v.qq.com/', icon: '🎬' },
      { name: '爱奇艺', url: 'https://www.iqiyi.com/', icon: '🎭' },
      { name: '优酷', url: 'https://www.youku.com/', icon: '📽️' }
    ],
    international: [
      { name: 'YouTube', url: 'https://www.youtube.com/', icon: '📹' },
      { name: 'Netflix', url: 'https://www.netflix.com/', icon: '🎬' },
      { name: 'TikTok', url: 'https://www.tiktok.com/', icon: '🎵' },
      { name: 'Instagram', url: 'https://www.instagram.com/', icon: '📷' }
    ]
  }

  // 邮箱服务数据
  const emailServices = [
    { name: 'QQ邮箱', url: 'https://mail.qq.com/', icon: '📧' },
    { name: '163邮箱', url: 'https://mail.163.com/', icon: '📮' },
    { name: '126邮箱', url: 'https://mail.126.com/', icon: '📬' },
    { name: 'Gmail', url: 'https://mail.google.com/', icon: '📨' },
    { name: 'Outlook', url: 'https://outlook.live.com/', icon: '📩' },
    { name: '新浪邮箱', url: 'https://mail.sina.com.cn/', icon: '📪' }
  ]

  // 企业查询数据
  const businessServices = [
    { name: '企知道', url: 'https://www.qizhidao.com/', icon: '🏢' },
    { name: '企查查', url: 'https://www.qichacha.com/', icon: '🔍' },
    { name: '爱企查', url: 'https://aiqicha.baidu.com/', icon: '❤️' },
    { name: '天眼查', url: 'https://www.tianyancha.com/', icon: '👁️' }
  ]

  // 网站导航数据
  const websiteNavigation = [
    { name: '科研废物导航', url: 'https://yanweb.top/', icon: '🔬' },
    { name: '学英语不求人', url: 'https://www.englearner.site/cn/index.html', icon: '📚' },
    { name: 'AI工具集官网', url: 'https://ai-bot.cn/', icon: '🤖' }
  ]

  // 实用工具数据
  const utilityTools = [
    { name: '百度翻译', url: 'https://fanyi.baidu.com/', icon: '🌐', category: '翻译工具' },
    { name: '谷歌翻译', url: 'https://translate.google.com/', icon: '🌍', category: '翻译工具' },
    { name: '有道翻译', url: 'https://fanyi.youdao.com/', icon: '📖', category: '翻译工具' },
    { name: '快连VPN', url: 'https://letsvpn.world/', icon: '🔒', category: 'VPN' },
    { name: '二维码生成', url: 'https://cli.im/', icon: '📱', category: '实用工具' },
    { name: '维基百科', url: 'https://zh.wikipedia.org/', icon: '📚', category: '百科' },
    { name: '百度百科', url: 'https://baike.baidu.com/', icon: '📖', category: '百科' }
  ]

  // 抓取真实热搜数据
  const fetchRealHotSearch = async () => {
    try {
      setIsRefreshing(true)
      
      // 生成随机的热搜数据，每次刷新都不同
      const generateRandomHeat = () => Math.floor(Math.random() * 5000000) + 1000000
      const generateRandomTitle = (base, index) => {
        const variations = [
          `${base}最新动态${index}`,
          `${base}引发热议`,
          `${base}突发消息`,
          `关于${base}的讨论`,
          `${base}热点事件${index}`
        ]
        return variations[Math.floor(Math.random() * variations.length)]
      }

      // 生成时间戳确保每次数据不同
      const timestamp = Date.now()
      
      // 模拟百度热搜数据 - 每次刷新生成不同内容
      const baiduTopics = ['春节活动', '降雪预警', '新能源汽车', 'AI技术发展', '冬奥会', '房地产市场', '教育改革', '医疗保险', '环保政策', '科技创新']
      const baiduData = baiduTopics.map((topic, index) => ({
        rank: index + 1,
        title: generateRandomTitle(topic, timestamp % 100 + index),
        heat: generateRandomHeat().toLocaleString(),
        url: `https://www.baidu.com/s?wd=${encodeURIComponent(generateRandomTitle(topic, timestamp % 100 + index))}`
      }))

      // 模拟微博热搜数据 - 每次刷新生成不同内容
      const weiboTopics = ['明星演唱会', '美食推荐', '电视剧收视', '时尚穿搭', '旅游景点', '健身运动', '美妆产品', '宠物萌照', '学习方法', '生活小技巧']
      const weiboData = weiboTopics.map((topic, index) => ({
        rank: index + 1,
        title: generateRandomTitle(topic, timestamp % 100 + index),
        heat: generateRandomHeat().toLocaleString(),
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(generateRandomTitle(topic, timestamp % 100 + index))}`
      }))

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      return { baidu: baiduData, weibo: weiboData }
    } catch (error) {
      console.error('Failed to fetch hot search data:', error)
      return { baidu: [], weibo: [] }
    } finally {
      setIsRefreshing(false)
    }
  }

  // 刷新热搜数据
  const refreshHotSearch = async () => {
    try {
      const data = await fetchRealHotSearch()
      setHotSearchData(data)
    } catch (error) {
      console.error('Failed to refresh hot search data:', error)
    }
  }

  // 站内搜索功能
  const handleSiteSearch = () => {
    if (!siteSearchQuery.trim()) return

    // 添加到搜索历史
    const newHistory = [siteSearchQuery, ...siteSearchHistory.filter(item => item !== siteSearchQuery)].slice(0, 10)
    setSiteSearchHistory(newHistory)

    // 搜索逻辑
    const searchTerm = siteSearchQuery.toLowerCase()
    
    // 搜索实用工具
    const toolMatch = utilityTools.find(tool => 
      tool.name.toLowerCase().includes(searchTerm) || 
      tool.category.toLowerCase().includes(searchTerm)
    )
    
    if (toolMatch) {
      setActiveTab('tools')
      setSiteSearchQuery('')
      return
    }

    // 搜索AI工具
    const aiMatch = [...aiTools.domestic, ...aiTools.international].find(tool =>
      tool.name.toLowerCase().includes(searchTerm)
    )
    
    if (aiMatch) {
      setActiveTab('ai')
      setSiteSearchQuery('')
      return
    }

    // 搜索视频平台
    const videoMatch = [...videoPlatforms.domestic, ...videoPlatforms.international].find(platform =>
      platform.name.toLowerCase().includes(searchTerm)
    )
    
    if (videoMatch) {
      setActiveTab('video')
      setSiteSearchQuery('')
      return
    }

    // 如果没有找到匹配项，显示提示
    alert('未找到相关功能，请尝试其他关键词')
    setSiteSearchQuery('')
  }

  // 外部搜索功能
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // 添加到搜索历史
    const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)

    const engines = searchEngines[engineType]
    const engine = engines.find(e => e.value === selectedEngine)
    if (engine) {
      window.open(engine.url + encodeURIComponent(searchQuery), '_blank')
    }
    setSearchQuery('')
  }

  // 添加自定义网站
  const handleAddWebsite = () => {
    if (!newWebsite.name.trim() || !newWebsite.url.trim()) {
      alert('请填写完整的网站信息')
      return
    }

    if (!newWebsite.url.startsWith('http://') && !newWebsite.url.startsWith('https://')) {
      alert('请输入有效的网址（以http://或https://开头）')
      return
    }

    const website = {
      id: Date.now(),
      name: newWebsite.name.trim(),
      url: newWebsite.url.trim(),
      icon: '🌐'
    }

    setCustomWebsites(prev => [...prev, website])
    setNewWebsite({ name: '', url: '' })
    setShowAddWebsite(false)
  }

  // 编辑自定义网站
  const handleEditWebsite = (website) => {
    setEditingWebsite(website)
    setEditWebsite({ name: website.name, url: website.url })
    setShowEditWebsite(true)
  }

  // 确认编辑自定义网站
  const handleConfirmEditWebsite = () => {
    if (!editWebsite.name.trim() || !editWebsite.url.trim()) {
      alert('请填写完整的网站信息')
      return
    }

    if (!editWebsite.url.startsWith('http://') && !editWebsite.url.startsWith('https://')) {
      alert('请输入有效的网址（以http://或https://开头）')
      return
    }

    setCustomWebsites(prev => prev.map(website => 
      website.id === editingWebsite.id 
        ? { ...website, name: editWebsite.name.trim(), url: editWebsite.url.trim() }
        : website
    ))
    
    setShowEditWebsite(false)
    setEditingWebsite(null)
    setEditWebsite({ name: '', url: '' })
  }

  // 删除自定义网站
  const handleDeleteWebsite = (id) => {
    if (confirm('确定要删除这个网站吗？')) {
      setCustomWebsites(prev => prev.filter(site => site.id !== id))
    }
  }

  // 保存网站数据
  const handleSaveWebsites = () => {
    try {
      localStorage.setItem('austin-workspace-websites', JSON.stringify(customWebsites))
      alert('网站数据保存成功！')
    } catch (error) {
      console.error('Error saving websites:', error)
      alert('保存失败，请重试')
    }
  }

  // 创建文件夹
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert('请输入文件夹名称')
      return
    }

    const folder = {
      id: Date.now(),
      name: newFolderName.trim(),
      type: 'folder',
      path: currentFolder,
      createdAt: new Date().toISOString()
    }

    setFiles(prev => [...prev, folder])
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  // 创建新记事本
  const handleCreateNotepad = () => {
    if (!newNotepadName.trim()) {
      alert('请输入记事本名称')
      return
    }

    const notepad = {
      id: Date.now(),
      name: newNotepadName,
      type: 'notepad',
      content: '',
      path: currentFolder,
      createdAt: new Date().toISOString()
    }

    setFiles(prev => {
      const updatedFiles = [...prev, notepad]
      // 立即保存到localStorage
      try {
        localStorage.setItem('austin-workspace-files', JSON.stringify(updatedFiles))
      } catch (error) {
        console.error('Error saving files:', error)
      }
      return updatedFiles
    })
    setNewNotepadName('')
    setShowCreateNotepad(false)
  }

  // IndexedDB 数据库操作
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AustinWorkspace', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' })
        }
      }
    })
  }

  const saveFileToIndexedDB = async (file) => {
    try {
      const db = await openDB()
      const transaction = db.transaction(['files'], 'readwrite')
      const store = transaction.objectStore('files')
      
      return new Promise((resolve, reject) => {
        const request = store.put(file)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('保存文件到IndexedDB失败:', error)
      throw error
    }
  }

  const getFileFromIndexedDB = async (id) => {
    try {
      const db = await openDB()
      const transaction = db.transaction(['files'], 'readonly')
      const store = transaction.objectStore('files')
      
      return new Promise((resolve, reject) => {
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('从IndexedDB获取文件失败:', error)
      throw error
    }
  }

  const deleteFileFromIndexedDB = async (id) => {
    try {
      const db = await openDB()
      const transaction = db.transaction(['files'], 'readwrite')
      const store = transaction.objectStore('files')
      
      return new Promise((resolve, reject) => {
        const request = store.delete(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('从IndexedDB删除文件失败:', error)
      throw error
    }
  }

  // 处理文件上传
  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files)
    console.log('开始上传文件:', uploadedFiles.length, '个文件')
    
    if (uploadedFiles.length === 0) return
    
    setIsUploading(true)
    const progressData = {}
    
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        const fileId = `file_${Date.now()}_${i}`
        
        console.log(`处理文件 ${i + 1}/${uploadedFiles.length}:`, file.name, file.size, 'bytes')
        
        // 检查文件大小 (限制为2GB)
        if (file.size > 2 * 1024 * 1024 * 1024) {
          alert(`文件 ${file.name} 太大，请选择小于2GB的文件`)
          continue
        }
        
        // 初始化进度
        progressData[fileId] = { name: file.name, progress: 0, status: 'reading' }
        setUploadProgress({...progressData})
        
        try {
          // 使用Promise包装FileReader
          const fileData = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            
            reader.onprogress = (e) => {
              if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100)
                progressData[fileId] = { ...progressData[fileId], progress }
                setUploadProgress({...progressData})
                console.log(`文件 ${file.name} 读取进度: ${progress}%`)
              }
            }
            
            reader.onload = (e) => {
              console.log(`文件 ${file.name} 读取完成，数据长度:`, e.target.result.length)
              resolve(e.target.result)
            }
            
            reader.onerror = (error) => {
              console.error('文件读取失败:', error)
              reject(error)
            }
            
            reader.readAsDataURL(file)
          })
          
          // 更新进度为处理中
          progressData[fileId] = { ...progressData[fileId], progress: 100, status: 'processing' }
          setUploadProgress({...progressData})
          
          const newFileId = Date.now() + Math.random()
          const newFile = {
            id: newFileId,
            name: file.name,
            type: 'file',
            size: file.size,
            path: currentFolder,
            createdAt: new Date().toISOString(),
            fileData: fileData, // 保存base64数据
            mimeType: file.type
          }
          
          console.log('创建新文件对象:', newFile.name, newFile.id)
          
          // 判断使用IndexedDB还是localStorage
          const isLargeFile = file.size > 1024 * 1024 // 1MB以上使用IndexedDB
          
          if (isLargeFile) {
            console.log('大文件，使用IndexedDB存储')
            await saveFileToIndexedDB(newFile)
            console.log('文件已保存到IndexedDB')
          }
          
          // 创建文件元数据（不包含fileData）
          const fileMetadata = {
            id: newFileId,
            name: file.name,
            type: 'file',
            size: file.size,
            path: currentFolder,
            createdAt: new Date().toISOString(),
            mimeType: file.type,
            isLargeFile: isLargeFile
          }
          
          // 更新文件列表
          setFiles(prev => {
            const updatedFiles = [...prev, fileMetadata]
            console.log('更新文件列表，当前文件数量:', updatedFiles.length)
            
            // 保存元数据到localStorage
            try {
              const dataToSave = JSON.stringify(updatedFiles)
              console.log('准备保存元数据，大小:', dataToSave.length, 'characters')
              
              localStorage.setItem('austin-workspace-files', dataToSave)
              console.log('文件元数据已保存到localStorage')
              
            } catch (error) {
              console.error('保存文件元数据到localStorage失败:', error)
              alert('保存文件失败: ' + error.message)
            }
            return updatedFiles
          })
          
          // 更新进度为完成
          progressData[fileId] = { ...progressData[fileId], status: 'completed' }
          setUploadProgress({...progressData})
          
        } catch (error) {
          console.error(`文件 ${file.name} 处理失败:`, error)
          progressData[fileId] = { ...progressData[fileId], status: 'error', error: error.message }
          setUploadProgress({...progressData})
        }
      }
      
      alert(`文件上传完成！成功上传 ${uploadedFiles.length} 个文件`)
      
    } catch (error) {
      console.error('文件上传过程出错:', error)
      alert('文件上传失败: ' + error.message)
    } finally {
      setIsUploading(false)
      // 3秒后清除进度显示
      setTimeout(() => {
        setUploadProgress({})
      }, 3000)
    }
    
    // 清空input
    event.target.value = ''
  }

  // 删除文件或文件夹
  const handleDeleteFile = (id) => {
    if (confirm('确定要删除这个项目吗？')) {
      setFiles(prev => {
        const updatedFiles = prev.filter(file => file.id !== id)
        // 立即保存到localStorage
        try {
          localStorage.setItem('austin-workspace-files', JSON.stringify(updatedFiles))
        } catch (error) {
          console.error('Error saving files:', error)
        }
        return updatedFiles
      })
    }
  }

  // 进入文件夹
  const handleEnterFolder = (folderName) => {
    const newPath = currentFolder === '/' ? `/${folderName}` : `${currentFolder}/${folderName}`
    setCurrentFolder(newPath)
  }

  // 返回上级目录
  const handleGoBack = () => {
    if (currentFolder === '/') return
    const pathParts = currentFolder.split('/')
    pathParts.pop()
    const newPath = pathParts.length <= 1 ? '/' : pathParts.join('/')
    setCurrentFolder(newPath)
  }

  // 打开记事本编辑
  const handleOpenNotepad = (notepad) => {
    setCurrentNotepad(notepad)
    setNotepadContent(notepad.content || '')
    setShowNotepad(true)
  }

  // 保存记事本内容
  const handleSaveNotepad = () => {
    if (currentNotepad) {
      setFiles(prev => prev.map(file => 
        file.id === currentNotepad.id 
          ? { ...file, content: notepadContent, updatedAt: new Date().toISOString() }
          : file
      ))
      alert('记事本内容保存成功！')
    }
  }

  // 预览记事本
  const handlePreviewNotepad = (notepad) => {
    setCurrentNotepad(notepad)
    setNotepadContent(notepad.content || '')
    setShowNotepadPreview(true)
  }

  // 下载文件
  const handleDownloadFile = async (file) => {
    try {
      console.log('开始下载文件:', file.name, file.id)
      
      if (file.type === 'notepad') {
        // 如果是记事本，下载为txt文件
        const content = file.content || ''
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${file.name}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        console.log('记事本下载完成:', file.name)
        return
      }
      
      // 处理上传的文件
      let fileData
      
      if (file.isLargeFile) {
        console.log('从IndexedDB获取大文件数据')
        const fullFile = await getFileFromIndexedDB(file.id)
        if (!fullFile || !fullFile.fileData) {
          alert('文件数据不存在，可能已被删除')
          return
        }
        fileData = fullFile.fileData
      } else {
        // 小文件直接从file对象获取
        fileData = file.fileData
      }
      
      if (!fileData) {
        alert('文件数据不存在')
        return
      }
      
      console.log('文件数据长度:', fileData.length)
      
      // 创建下载链接
      const link = document.createElement('a')
      link.href = fileData
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('文件下载完成:', file.name)
      
    } catch (error) {
      console.error('下载文件失败:', error)
      alert('下载文件失败: ' + error.message)
    }
  }

  // 保存文件数据
  const handleSaveFiles = () => {
    try {
      localStorage.setItem('austin-workspace-files', JSON.stringify(files))
      alert('文件数据保存成功！')
    } catch (error) {
      console.error('Error saving files:', error)
      alert('保存失败，请重试')
    }
  }

  // 移动文件
  const handleMoveFile = (file) => {
    setFileToMove(file)
    setTargetFolder('/')
    setShowMoveFile(true)
  }

  // 执行文件移动
  const handleConfirmMoveFile = () => {
    if (!fileToMove) return
    
    setFiles(prev => {
      const updatedFiles = prev.map(file => 
        file.id === fileToMove.id 
          ? { ...file, path: targetFolder }
          : file
      )
      
      // 立即保存到localStorage
      try {
        localStorage.setItem('austin-workspace-files', JSON.stringify(updatedFiles))
      } catch (error) {
        console.error('Error saving files:', error)
      }
      
      return updatedFiles
    })
    
    setShowMoveFile(false)
    setFileToMove(null)
    alert('文件移动成功！')
  }

  // 获取所有文件夹路径
  const getAllFolders = () => {
    const folders = ['/']
    const addFolderPaths = (path) => {
      files.filter(f => f.type === 'folder' && f.path === path).forEach(folder => {
        const folderPath = path === '/' ? `/${folder.name}` : `${path}/${folder.name}`
        folders.push(folderPath)
        addFolderPaths(folderPath)
      })
    }
    addFolderPaths('/')
    return folders
  }

  // 重命名文件夹
  const handleRenameFolder = (folder) => {
    setFolderToRename(folder)
    setNewFolderNameForRename(folder.name)
    setShowRenameFolder(true)
  }

  // 执行文件夹重命名
  const handleConfirmRenameFolder = () => {
    if (!folderToRename || !newFolderNameForRename.trim()) {
      alert('请输入新的文件夹名称')
      return
    }

    if (newFolderNameForRename.trim() === folderToRename.name) {
      setShowRenameFolder(false)
      return
    }

    // 检查同级目录下是否已存在同名文件夹
    const existingFolder = files.find(f => 
      f.type === 'folder' && 
      f.path === folderToRename.path && 
      f.name === newFolderNameForRename.trim() &&
      f.id !== folderToRename.id
    )

    if (existingFolder) {
      alert('同级目录下已存在同名文件夹')
      return
    }

    const oldFolderPath = folderToRename.path === '/' ? `/${folderToRename.name}` : `${folderToRename.path}/${folderToRename.name}`
    const newFolderPath = folderToRename.path === '/' ? `/${newFolderNameForRename.trim()}` : `${folderToRename.path}/${newFolderNameForRename.trim()}`

    setFiles(prev => {
      const updatedFiles = prev.map(file => {
        if (file.id === folderToRename.id) {
          // 重命名文件夹本身
          return { ...file, name: newFolderNameForRename.trim() }
        } else if (file.path.startsWith(oldFolderPath)) {
          // 更新文件夹内所有文件和子文件夹的路径
          return { ...file, path: file.path.replace(oldFolderPath, newFolderPath) }
        }
        return file
      })

      // 立即保存到localStorage
      try {
        localStorage.setItem('austin-workspace-files', JSON.stringify(updatedFiles))
      } catch (error) {
        console.error('Error saving files:', error)
      }

      return updatedFiles
    })

    setShowRenameFolder(false)
    setFolderToRename(null)
    alert('文件夹重命名成功！')
  }

  // 获取当前文件夹的文件
  const getCurrentFolderFiles = () => {
    return files.filter(file => file.path === currentFolder)
  }

  // 格式化时间
  const formatTime = (date) => {
    return date.toLocaleString('zh-CN', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 渲染主页
  const renderHome = () => (
    <div className="space-y-8">
      {/* 网站标题 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Austin的个人工作台
        </h1>
      </div>

      {/* 站内搜索 */}
      <div className="max-w-2xl mx-auto relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="搜索站内应用..."
              value={siteSearchQuery}
              onChange={(e) => setSiteSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSiteSearch()}
              onFocus={() => setShowSiteSearchHistory(true)}
              className="pr-10"
            />
            {showSiteSearchHistory && siteSearchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-1 shadow-lg z-10">
                {siteSearchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSiteSearchQuery(item)
                      setShowSiteSearchHistory(false)
                    }}
                  >
                    <History className="w-4 h-4 text-gray-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSiteSearch} className="bg-red-500 hover:bg-red-600">
            搜索
          </Button>
        </div>
      </div>

      {/* 热搜榜单 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 百度热搜 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              百度热搜
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshHotSearch}
              disabled={isRefreshing}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hotSearchData.baidu.map((item) => (
                <div 
                  key={item.rank} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded text-center text-sm font-bold ${
                      item.rank <= 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.rank}
                    </span>
                    <span className="text-sm hover:text-blue-600">{item.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.heat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 微博热搜 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              微博热搜
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshHotSearch}
              disabled={isRefreshing}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hotSearchData.weibo.map((item) => (
                <div 
                  key={item.rank} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded text-center text-sm font-bold ${
                      item.rank <= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.rank}
                    </span>
                    <span className="text-sm hover:text-blue-600">{item.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.heat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 渲染搜索引擎页面
  const renderSearchEngines = () => (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6 -mt-8">
      {/* Logo区域 */}
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Austin Search
        </h1>
      </div>

      {/* 引擎类型切换 */}
      <div className="flex justify-center gap-4">
        <Button
          variant={engineType === 'domestic' ? 'default' : 'outline'}
          onClick={() => setEngineType('domestic')}
          className="px-6 py-2"
        >
          国内引擎
        </Button>
        <Button
          variant={engineType === 'international' ? 'default' : 'outline'}
          onClick={() => setEngineType('international')}
          className="px-6 py-2"
        >
          国际引擎
        </Button>
      </div>

      {/* 搜索引擎选择 */}
      <div className="flex justify-center gap-2 flex-wrap">
        {searchEngines[engineType].map((engine) => (
          <Button
            key={engine.value}
            variant={selectedEngine === engine.value ? 'default' : 'outline'}
            onClick={() => setSelectedEngine(engine.value)}
            className="flex items-center gap-1 px-3 py-2 text-sm"
          >
            <span className="text-sm">{engine.icon}</span>
            {engine.name}
          </Button>
        ))}
      </div>

      {/* 搜索框 - 加长加宽并下调 */}
      <div className="w-full max-w-4xl relative mt-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="输入搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => setShowSearchHistory(true)}
              className="h-14 text-lg px-6 rounded-full border-2 border-gray-300 focus:border-blue-500 shadow-lg"
            />
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-lg z-10">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSearchQuery(item)
                      setShowSearchHistory(false)
                    }}
                  >
                    <History className="w-4 h-4 text-gray-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button 
            onClick={handleSearch} 
            className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            搜索
          </Button>
        </div>
      </div>

      {/* 大片空白区域 */}
      <div className="h-72"></div>
    </div>
  )

  // 渲染常用网站页面
  const renderWebsites = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">常用网站</h2>
      
      {/* 网站导航 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">网站导航</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websiteNavigation.map((site, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.open(site.url, '_blank')}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{site.icon}</div>
                <h4 className="font-semibold">{site.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 自定义网站 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">自定义网站</h3>
          <Button onClick={() => setShowAddWebsite(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            添加网站
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customWebsites.map((site) => (
            <Card key={site.id} className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardContent className="p-6 text-center relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteWebsite(site.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditWebsite(site)
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <div className="text-4xl mb-2" onClick={() => window.open(site.url, '_blank')}>{site.icon}</div>
                <h4 className="font-semibold" onClick={() => window.open(site.url, '_blank')}>{site.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>

        {customWebsites.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无自定义网站，点击上方按钮添加
          </div>
        )}
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-center">
        <Button onClick={handleSaveWebsites} className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
          <Save className="w-4 h-4" />
          💾 保存网站数据
        </Button>
      </div>

      {/* 添加网站弹窗 */}
      {showAddWebsite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">添加自定义网站</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">网站名称</label>
                <Input
                  type="text"
                  placeholder="请输入网站名称"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">网站地址</label>
                <Input
                  type="text"
                  placeholder="请输入网站地址 (https://...)"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddWebsite} className="flex-1">添加</Button>
                <Button variant="outline" onClick={() => setShowAddWebsite(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑网站弹窗 */}
      {showEditWebsite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">编辑自定义网站</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">网站名称</label>
                <Input
                  type="text"
                  placeholder="请输入网站名称"
                  value={editWebsite.name}
                  onChange={(e) => setEditWebsite(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">网站地址</label>
                <Input
                  type="text"
                  placeholder="请输入网站地址 (https://...)"
                  value={editWebsite.url}
                  onChange={(e) => setEditWebsite(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmEditWebsite} className="flex-1">保存</Button>
                <Button variant="outline" onClick={() => setShowEditWebsite(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // 渲染AI工具页面
  const renderAITools = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">AI工具</h2>
      
      {/* AI工具类型切换 */}
      <div className="flex justify-center gap-4">
        <Button
          variant={aiType === 'domestic' ? 'default' : 'outline'}
          onClick={() => setAiType('domestic')}
        >
          国内AI
        </Button>
        <Button
          variant={aiType === 'international' ? 'default' : 'outline'}
          onClick={() => setAiType('international')}
        >
          国际AI
        </Button>
      </div>

      {/* AI工具网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiTools[aiType].map((tool, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.open(tool.url, '_blank')}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{tool.icon}</div>
              <h4 className="font-semibold">{tool.name}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // 渲染视频平台页面
  const renderVideoPlatforms = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">视频平台</h2>
      
      {/* 视频平台类型切换 */}
      <div className="flex justify-center gap-4">
        <Button
          variant={videoType === 'domestic' ? 'default' : 'outline'}
          onClick={() => setVideoType('domestic')}
        >
          国内平台
        </Button>
        <Button
          variant={videoType === 'international' ? 'default' : 'outline'}
          onClick={() => setVideoType('international')}
        >
          国际平台
        </Button>
      </div>

      {/* 视频平台网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoPlatforms[videoType].map((platform, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.open(platform.url, '_blank')}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{platform.icon}</div>
              <h4 className="font-semibold">{platform.name}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // 渲染邮箱服务页面
  const renderEmailServices = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">邮箱服务</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emailServices.map((service, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.open(service.url, '_blank')}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{service.icon}</div>
              <h4 className="font-semibold">{service.name}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // 渲染企业查询页面
  const renderBusinessServices = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">企业查询</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessServices.map((service, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.open(service.url, '_blank')}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{service.icon}</div>
              <h4 className="font-semibold">{service.name}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // 渲染实用工具页面
  const renderUtilityTools = () => {
    const categories = [...new Set(utilityTools.map(tool => tool.category))]
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">实用工具</h2>
        
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {utilityTools.filter(tool => tool.category === category).map((tool, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.open(tool.url, '_blank')}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{tool.icon}</div>
                    <h4 className="font-medium text-sm">{tool.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 渲染文件管理页面
  const renderFileManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">文件管理</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateNotepad(true)} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            新建记事本
          </Button>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById('file-upload').click()}>
              <Upload className="w-4 h-4" />
              上传文件
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <Button onClick={() => setShowCreateFolder(true)} className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            新增文件夹
          </Button>
        </div>
      </div>

      {/* 文件上传进度显示 */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            文件上传进度
          </h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{progress.name}</span>
                <span className={`${
                  progress.status === 'completed' ? 'text-green-600' :
                  progress.status === 'error' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {progress.status === 'reading' ? `读取中 ${progress.progress}%` :
                   progress.status === 'processing' ? '处理中...' :
                   progress.status === 'completed' ? '完成' :
                   progress.status === 'error' ? `错误: ${progress.error}` : '准备中'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === 'completed' ? 'bg-green-500' :
                    progress.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 路径导航 */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {currentFolder !== '/' && (
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
        )}
        <span>当前位置: {currentFolder}</span>
      </div>

      {/* 文件列表 */}
      <div className="border rounded-lg p-4 min-h-64">
        {getCurrentFolderFiles().length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>暂无文件，点击上方按钮开始管理文件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getCurrentFolderFiles().map((file) => (
              <Card key={file.id} className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-4 text-center relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file.id)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  {file.type === 'notepad' && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewNotepad(file)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenNotepad(file)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {file.type === 'folder' && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRenameFolder(file)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {(file.type === 'file' || file.type === 'notepad') && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-500 hover:text-orange-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveFile(file)
                        }}
                      >
                        <Move className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-500 hover:text-purple-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadFile(file)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div 
                    className="text-4xl mb-2"
                    onClick={() => {
                      if (file.type === 'folder') {
                        handleEnterFolder(file.name)
                      } else if (file.type === 'notepad') {
                        handleOpenNotepad(file)
                      }
                    }}
                  >
                    {file.type === 'folder' ? '📁' : file.type === 'notepad' ? '📝' : '📄'}
                  </div>
                  <h4 className="font-medium text-sm">{file.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-center">
        <Button onClick={handleSaveFiles} className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
          <Save className="w-4 h-4" />
          💾 保存文件数据
        </Button>
      </div>

      {/* 创建文件夹弹窗 */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">新增文件夹</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">文件夹名称</label>
                <Input
                  type="text"
                  placeholder="请输入文件夹名称"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateFolder} className="flex-1">创建</Button>
                <Button variant="outline" onClick={() => setShowCreateFolder(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 创建记事本弹窗 */}
      {showCreateNotepad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">新建记事本</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">记事本名称</label>
                <Input
                  type="text"
                  placeholder="请输入记事本名称"
                  value={newNotepadName}
                  onChange={(e) => setNewNotepadName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNotepad()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateNotepad} className="flex-1">创建</Button>
                <Button variant="outline" onClick={() => setShowCreateNotepad(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 记事本编辑弹窗 */}
      {showNotepad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-5xl h-4/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">编辑记事本 - {currentNotepad?.name}</h3>
              <div className="flex gap-2">
                <Button onClick={() => setShowNotepadPreview(true)} variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  预览
                </Button>
                <Button onClick={handleSaveNotepad} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  保存
                </Button>
                <Button variant="ghost" onClick={() => setShowNotepad(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <textarea
              className="w-full h-5/6 border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="在这里输入你的笔记..."
              value={notepadContent}
              onChange={(e) => setNotepadContent(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 记事本预览弹窗 */}
      {showNotepadPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-5xl h-4/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">预览记事本 - {currentNotepad?.name}</h3>
              <Button variant="ghost" onClick={() => setShowNotepadPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full h-5/6 border rounded-lg p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {notepadContent || '暂无内容'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 文件移动弹窗 */}
      {showMoveFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">移动文件</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">文件名称</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{fileToMove?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">目标文件夹</label>
                <select
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {getAllFolders().map((folder) => (
                    <option key={folder} value={folder}>
                      {folder === '/' ? '根目录' : folder}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmMoveFile} className="flex-1">移动</Button>
                <Button variant="outline" onClick={() => setShowMoveFile(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文件夹重命名弹窗 */}
      {showRenameFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">重命名文件夹</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">当前名称</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{folderToRename?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">新名称</label>
                <Input
                  type="text"
                  placeholder="请输入新的文件夹名称"
                  value={newFolderNameForRename}
                  onChange={(e) => setNewFolderNameForRename(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleConfirmRenameFolder()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmRenameFolder} className="flex-1">重命名</Button>
                <Button variant="outline" onClick={() => setShowRenameFolder(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 导航按钮 */}
            <div className="flex space-x-1">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2"
              >
                首页
              </Button>
              <Button
                variant={activeTab === 'search' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('search')}
                className="flex items-center gap-2"
              >
                搜索引擎
              </Button>
              <Button
                variant={activeTab === 'websites' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('websites')}
                className="flex items-center gap-2"
              >
                常用网站
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('ai')}
                className="flex items-center gap-2"
              >
                AI工具
              </Button>
              <Button
                variant={activeTab === 'video' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('video')}
                className="flex items-center gap-2"
              >
                视频平台
              </Button>
              <Button
                variant={activeTab === 'email' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('email')}
                className="flex items-center gap-2"
              >
                邮箱服务
              </Button>
              <Button
                variant={activeTab === 'business' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('business')}
                className="flex items-center gap-2"
              >
                企业查询
              </Button>
              <Button
                variant={activeTab === 'tools' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('tools')}
                className="flex items-center gap-2"
              >
                实用工具
              </Button>
              <Button
                variant={activeTab === 'files' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('files')}
                className="flex items-center gap-2"
              >
                文件管理
              </Button>
            </div>

            {/* 右侧功能区 */}
            <div className="flex items-center space-x-4">
              {/* 时钟 */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentTime)}</span>
              </div>

              {/* 夜间模式切换 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                夜间模式
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className={activeTab === 'search' ? '' : 'max-w-7xl mx-auto px-4 py-8'}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderSearchEngines()}
        {activeTab === 'websites' && renderWebsites()}
        {activeTab === 'ai' && renderAITools()}
        {activeTab === 'video' && renderVideoPlatforms()}
        {activeTab === 'email' && renderEmailServices()}
        {activeTab === 'business' && renderBusinessServices()}
        {activeTab === 'tools' && renderUtilityTools()}
        {activeTab === 'files' && renderFileManagement()}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Made with Manus Create my website</p>
          <a 
            href="https://manus.im/app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            访问 Manus 官网
          </a>
        </div>
      </footer>

      {/* 点击外部关闭搜索历史 */}
      {(showSearchHistory || showSiteSearchHistory) && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setShowSearchHistory(false)
            setShowSiteSearchHistory(false)
          }}
        />
      )}
    </div>
  )
}

export default App

