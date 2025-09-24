import React, { useState } from 'react';
import { QuestionChoiceModalProps } from '../types';
import { MagicSparklesIcon, PencilIcon } from './icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const QuestionChoiceModal: React.FC<QuestionChoiceModalProps> = ({ username, onGenerate, onSubmit, onClose }) => {
    const [customQuestion, setCustomQuestion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateClick = async () => {
        setLoading(true);
        await onGenerate();
        // The modal will unmount, no need to setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(customQuestion.trim() === '' || loading) return;
        setLoading(true);
        await onSubmit(customQuestion);
        // The modal will unmount, no need to setLoading(false)
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose?.()}>
            <DialogContent className="w-full max-w-md p-8 text-center" showCloseButton={!!onClose}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-white mb-2">
                        {username}, het is jouw dag!
                    </DialogTitle>
                    <p className="text-purple-300 text-lg mb-6">
                        Kies de vraag die jullie vandaag zullen beantwoorden.
                    </p>
                </DialogHeader>
                
                <Button 
                    onClick={handleGenerateClick}
                    disabled={loading}
                    className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <MagicSparklesIcon className="mr-2" /> {loading ? 'Moment creëren...' : 'Laat een vraag genereren'}
                </Button>
                
                <p className="text-purple-300 mb-4">- of -</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea 
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Stel hier je eigen vraag..."
                        required
                        disabled={loading}
                        className="min-h-[80px] bg-purple-900/50 border-purple-400 text-white placeholder:text-purple-300"
                    />
                    <Button 
                        type="submit" 
                        disabled={customQuestion.trim() === '' || loading}
                        className="w-full bg-purple-800 hover:bg-purple-900 text-white"
                    >
                        <PencilIcon className="mr-2" /> {loading ? 'Moment creëren...' : 'Stel deze vraag'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default QuestionChoiceModal;