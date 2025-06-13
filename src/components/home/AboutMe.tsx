import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Briefcase, Coffee, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutMe = () => {
  const skills = ['TypeScript', 'Next.js', 'React', 'Node.js', 'Python', 'Firebase', 'Tailwind CSS', 'UI/UX Design'];

  return (
    <section id="about" className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          <Card className="w-full max-w-sm shadow-xl">
            <CardContent className="p-0">
              <Image
                src="https://placehold.co/400x500/122624/F2F2F2.png?text=Your+Photo"
                alt="Your Name"
                width={400}
                height={500}
                className="rounded-t-lg object-cover w-full h-auto"
                data-ai-hint="professional portrait"
              />
            </CardContent>
            <div className="p-6 bg-card rounded-b-lg">
                <h3 className="font-headline text-2xl font-semibold text-primary dark:text-foreground">Your Name</h3>
                <p className="text-accent">Full-Stack Developer & UI/UX Enthusiast</p>
                <Button variant="outline" className="mt-4 w-full text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                  <Download size={18} className="mr-2" />
                  Download CV
                </Button>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-6 dark:text-foreground">
            About Me
          </h2>
          <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
            Hello! I&apos;m a passionate and results-oriented software developer with a keen eye for design and user experience. 
            I specialize in building modern, responsive web applications using cutting-edge technologies. 
            My journey in tech is driven by a love for problem-solving and creating digital solutions that are both functional and beautiful.
          </p>
          <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
            When I&apos;m not coding, you can find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee. 
            I believe in continuous learning and always strive to expand my skill set.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="text-center bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader>
                <Award size={32} className="mx-auto text-accent mb-2" />
                <CardTitle className="text-lg font-headline text-primary dark:text-foreground">Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">3+ Years</p>
                <p className="text-sm text-muted-foreground">Full-Stack Development</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader>
                <Briefcase size={32} className="mx-auto text-accent mb-2" />
                <CardTitle className="text-lg font-headline text-primary dark:text-foreground">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">15+</p>
                <p className="text-sm text-muted-foreground">Completed Successfully</p>
              </CardContent>
            </Card>
             <Card className="text-center bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader>
                <Coffee size={32} className="mx-auto text-accent mb-2" />
                <CardTitle className="text-lg font-headline text-primary dark:text-foreground">Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-accent">Innovation</p>
                <p className="text-sm text-muted-foreground">Creative Problem Solving</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="font-headline text-2xl font-semibold text-primary mb-4 dark:text-foreground">My Skills</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill} className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
