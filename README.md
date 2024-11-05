# ResumeItNow - Free & Open Source Resume Builder 🚀

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/CityIsBetter/ResumeItNow/issues)
[![Stars](https://img.shields.io/github/stars/CityIsBetter/ResumeItNow?style=social)](https://github.com/CityIsBetter/ResumeItNow/stargazers)

[Demo](https://resumeitnow.vercel.app) · [Report Bug](https://github.com/CityIsBetter/ResumeItNow/issues) · [Request Feature](https://github.com/CityIsBetter/ResumeItNow/issues)

![ResumeItNow Preview](https://i.imgur.com/F0iOLCB.jpeg)

</div>

ResumeItNow is a free, open-source resume builder that helps job seekers create professional resumes without watermarks or hidden fees. Built with modern technologies and powered by AI, it offers a seamless experience for creating ATS-friendly resumes.

## ✨ Features

- 🎯 **ATS-Friendly Templates**: Professionally designed templates optimized for Applicant Tracking Systems
- 🤖 **AI-Powered**: Smart content suggestions and auto-generation powered by Llama 3.1
- 💳 **100% Free**: No credit card required, no hidden fees
- 🎨 **Customizable**: Multiple layout options and customizable sections
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- 📤 **Export Options**: Download as PDF, share links, and more

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)
- [Llama 3.1](https://llama.ai)

## 🤝 Contributing

We love contributions! There are many ways you can help improve ResumeItNow:

### Adding New Resume Templates

1. Create a new template in the `components/resume/templates` directory
2. I would reccomend you to duplicate existing template and work over it.
3. Add preview image in `public/assets/`
4. Add template selection in `app/resume/[resumeId]/resumeView.tsx`
   ```
   <SelectItem value="template_name">Template Name</SelectItem>
   ```
6. Submit a pull request

### Template Guidelines

- Must be ATS-friendly
- Responsive design
- Clean, professional layout
- Support all standard resume sections
- Follow accessibility best practices
- Use Tailwind CSS for styling

### Other Contributions

- 🐛 Fix bugs and issues
- ✨ Add new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- ⚡ Optimize performance
- 🌐 Add translations

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icons

## 💌 Contact

- Website: [resumeitnow.com](https://resumeitnow.vercel.app)

---

<div align="center">
  <sub>Built with ❤️</sub>
</div>
