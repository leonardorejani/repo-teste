import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, Upload, Download, LayoutGrid, List, Layers, Filter, Star, BookOpen, XCircle, Settings, Heart, History, StickyNote, Moon, Sun, AlertTriangle, CheckCircle, Info, ChevronDown, Menu } from 'lucide-react';

// Categorias predefinidas baseadas no acervo
const CATEGORIAS_PREDEFINIDAS = [
  "ADOLESCENTES",
  "ARQUEOLOGIA",
  "AUTO BIOGRAFIA / BIOGRAFIA",
  "BÍBLIA",
  "COMENTÁRIO",
  "CONCORDÂNCIA",
  "CRISTIANISMO / OUTRAS RELIGIÕES",
  "DEUS, CIÊNCIA E RELIGIÃO",
  "DICIONÁRIO",
  "DIVERSOS",
  "ESCATOLOGIA",
  "ESPÍRITO",
  "ESTUDO BÍBLICO",
  "ÉTICA / ÉTICA CRISTÃ",
  "FAMÍLIA / CASAMENTO",
  "FICÇÃO / LITERATURA",
  "FINANÇAS / DINHEIRO",
  "GEOGRAFIA",
  "GREGO",
  "HEBRAICO",
  "HINÁRIO",
  "HISTÓRIA DA IGREJA",
  "HOMENS",
  "IGREJA",
  "INFORMÁTICA",
  "JESUS",
  "LIDERANÇA",
  "LIDERANÇA / PASTOR",
  "LÍNGUA PORTUGUESA",
  "LIVROS MENORES",
  "LOUVOR / POESIA / TEATRO",
  "MENSAGENS",
  "MISSÕES",
  "MISSÕES E EVANGELISMO",
  "MULHER",
  "PSICOLOGIA",
  "SEITAS",
  "SEXO",
  "TEOLOGIA",
  "TEOLOGIA SISTEMÁTICA",
  "VIDA CRISTÃ / DEVOCIONAIS"
];

const PRATELEIRAS_PREDEFINIDAS = [
  "PRATELEIRA A",
  "PRATELEIRA B",
  "PRATELEIRA C",
  "PRATELEIRA D",
  "PRATELEIRA E",
  "PRATELEIRA F",
  "PRATELEIRA G",
  "PRATELEIRA H",
  "PRATELEIRA I",
  "PRATELEIRA J",
  "PRATELEIRA K",
  "PRATELEIRA L",
  "PRATELEIRA M",
  "PRATELEIRA N",
  "PRATELEIRA O",
  "PRATELEIRA P",
  "PRATELEIRA Q",
  "PRATELEIRA R",
  "PRATELEIRA S",
  "PRATELEIRA T",
  "PRATELEIRA U",
  "PRATELEIRA V",
  "PRATELEIRA W",
  "PRATELEIRA X",
  "PRATELEIRA Y",
  "PRATELEIRA Z"
];

// Componente Toast para notificações
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : type === 'warning' ? AlertTriangle : Info;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce" style={{ animation: 'slideDown 0.3s ease-out' }}>
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white min-w-[280px] max-w-[90vw]" style={{ backgroundColor: bgColor }}>
        <Icon size={20} className="flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="p-1 rounded-full flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// Componente de Confirmação
function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText, confirmColor, themeColors }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]" onClick={onCancel}>
      <div
        className="rounded-2xl max-w-sm w-full p-6 shadow-2xl"
        style={{ backgroundColor: themeColors?.bgSecondary || '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: themeColors?.text || '#000' }}>{title}</h3>
        </div>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: themeColors?.textSecondary || '#666' }}>{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border rounded-xl font-medium transition hover:opacity-80"
            style={{ borderColor: themeColors?.border || '#e0e0e0', color: themeColors?.text || '#000' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: confirmColor || '#dc2626' }}
          >
            {confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BibliotecaDigital() {
  const [livros, setLivros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('lista');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [showNotasModal, setShowNotasModal] = useState(false);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteSearchTerm, setDeleteSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedLivroNotas, setSelectedLivroNotas] = useState(null);
  const [historicoLivro, setHistoricoLivro] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showEmprestarModal, setShowEmprestarModal] = useState(false);
  const [emprestarLivro, setEmprestarLivro] = useState(null);
  const [emprestarNome, setEmprestarNome] = useState('');
  const [detalheLivro, setDetalheLivro] = useState(null);
  const [showAcoes, setShowAcoes] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const listRef = useRef(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => setToast({ message, type, key: Date.now() });

  // Confirmação
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Configurações
  const [config, setConfig] = useState({
    darkMode: false,
    fontSize: 'medium',
    defaultView: 'lista',
    ordenacao: 'titulo-asc',
    densidade: 'normal'
  });

  // Filtros
  const [filtros, setFiltros] = useState({
    prateleira: '',
    categoria: '',
    status: '',
    autor: '',
    favorito: false
  });
  const [showFiltros, setShowFiltros] = useState(false);

  // Form state - campos baseados na planilha do acervo
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    editora: '',
    categoria: '',
    prateleira: '',
    ano: '',
    isbn: '',
    codigo: '',
    tombamento: '',
    volume: '',
    exemplar: '',
    nrEdicao: '',
    dono: '',
    status: 'nao-lido',
    favorito: false,
    emprestadoPara: '',
    dataEmprestimo: '',
    historicoEmprestimos: [],
    rating: 0,
    notas: '',
    anotacoes: '',
    capaUrl: ''
  });

  const statusConfig = {
    'nao-lido': { label: 'Não Lido', color: 'bg-gray-500' },
    'lendo': { label: 'Lendo', color: 'bg-blue-500' },
    'lido': { label: 'Lido', color: 'bg-green-500' },
    'emprestado': { label: 'Emprestado', color: 'bg-yellow-500' }
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const densidadeClasses = {
    compacto: 'space-y-1',
    normal: 'space-y-2',
    espacado: 'space-y-4'
  };

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get('biblioteca-livros');
        if (result) {
          setLivros(JSON.parse(result.value));
        }
      } catch (e) {
        console.log('Primeira vez usando');
      }

      try {
        const configResult = await window.storage.get('biblioteca-config');
        if (configResult) {
          const savedConfig = JSON.parse(configResult.value);
          setConfig(savedConfig);
          setViewMode(savedConfig.defaultView);
        }
      } catch (e) {
        console.log('Config padrão');
      }
    };
    loadData();
  }, []);

  const saveLivros = async (newLivros) => {
    setLivros(newLivros);
    await window.storage.set('biblioteca-livros', JSON.stringify(newLivros));
  };

  const saveConfig = async (newConfig) => {
    setConfig(newConfig);
    await window.storage.set('biblioteca-config', JSON.stringify(newConfig));
  };

  // CRUD
  const addLivro = () => {
    if (!formData.titulo.trim() || !formData.autor.trim()) {
      showToast('Título e Autor são obrigatórios!', 'warning');
      return;
    }

    // Verificar duplicata pelo título exato
    const tituloNormalizado = formData.titulo.trim().toUpperCase();
    const duplicata = livros.find(l => l.titulo.trim().toUpperCase() === tituloNormalizado);
    if (duplicata) {
      showToast(`Já existe um livro com este título: "${duplicata.titulo}"`, 'error');
      return;
    }

    const novoLivro = {
      id: Date.now(),
      ...formData,
      titulo: formData.titulo.trim(),
      autor: formData.autor.trim(),
      historicoEmprestimos: formData.historicoEmprestimos || []
    };
    saveLivros([...livros, novoLivro]);
    resetForm();
    setShowAddModal(false);
    showToast('Livro adicionado com sucesso!', 'success');
  };

  const updateLivro = () => {
    if (!formData.titulo.trim() || !formData.autor.trim()) {
      showToast('Título e Autor são obrigatórios!', 'warning');
      return;
    }

    // Verificar duplicata pelo título exato (excluindo o livro que está sendo editado)
    const tituloNormalizado = formData.titulo.trim().toUpperCase();
    const duplicata = livros.find(l => l.id !== editingId && l.titulo.trim().toUpperCase() === tituloNormalizado);
    if (duplicata) {
      showToast(`Já existe um livro com este título: "${duplicata.titulo}"`, 'error');
      return;
    }

    // Se estava emprestado e agora está devolvido, adicionar ao histórico
    const livroAnterior = livros.find(l => l.id === editingId);
    let novoHistorico = [...(formData.historicoEmprestimos || [])];

    if (livroAnterior?.status === 'emprestado' && formData.status !== 'emprestado' && livroAnterior.emprestadoPara) {
      novoHistorico.push({
        pessoa: livroAnterior.emprestadoPara,
        dataEmprestimo: livroAnterior.dataEmprestimo,
        dataDevolucao: new Date().toISOString().split('T')[0]
      });
    }

    const updated = livros.map(l => l.id === editingId ? { ...formData, id: editingId, historicoEmprestimos: novoHistorico } : l);
    saveLivros(updated);
    resetForm();
    setEditingId(null);
    setShowAddModal(false);
    showToast('Livro atualizado com sucesso!', 'success');
  };

  // Deletar livro individual (com confirmação via modal)
  const deleteLivro = (id) => {
    setShowAddModal(false);
    resetForm();
    setEditingId(null);
    setTimeout(() => {
      setConfirmDialog({
        title: 'Deletar Livro',
        message: 'Tem certeza que deseja deletar este livro? Esta ação não pode ser desfeita!',
        confirmText: 'Deletar',
        onConfirm: () => {
          setConfirmDialog(null);
          const novosLivros = livros.filter(l => l.id !== id);
          saveLivros(novosLivros);
          showToast('Livro deletado com sucesso!', 'success');
        }
      });
    }, 100);
  };

  // Deletar múltiplos livros (com confirmação via modal)
  const deleteMultipleLivros = () => {
    if (selectedForDelete.length === 0) {
      showToast('Selecione pelo menos um livro para deletar!', 'warning');
      return;
    }
    const count = selectedForDelete.length;
    const idsToDelete = [...selectedForDelete];
    setShowDeleteMultipleModal(false);
    setTimeout(() => {
      setConfirmDialog({
        title: 'Deletar Múltiplos Livros',
        message: `Tem certeza que deseja deletar ${count} livro(s)? Esta ação não pode ser desfeita!`,
        confirmText: `Deletar ${count}`,
        onConfirm: () => {
          setConfirmDialog(null);
          const novosLivros = livros.filter(l => !idsToDelete.includes(l.id));
          saveLivros(novosLivros);
          setSelectedForDelete([]);
          showToast(`${count} livro(s) deletado(s) com sucesso!`, 'success');
        }
      });
    }, 100);
  };

  // Limpar todos os dados (com dupla confirmação via modal)
  const limparTodosDados = () => {
    setShowConfigModal(false);
    setTimeout(() => {
      setConfirmDialog({
        title: '⚠️ Apagar TODOS os Dados',
        message: 'ATENÇÃO! Isso vai APAGAR TODOS OS LIVROS permanentemente! Deseja continuar?',
        confirmText: 'Sim, apagar tudo',
        onConfirm: () => {
          setConfirmDialog({
            title: '🚨 ÚLTIMA CONFIRMAÇÃO',
            message: 'Tem CERTEZA ABSOLUTA? Todos os dados serão perdidos para sempre! Esta ação é IRREVERSÍVEL!',
            confirmText: 'APAGAR TUDO',
            onConfirm: () => {
              setConfirmDialog(null);
              saveLivros([]);
              showToast('Todos os dados foram apagados com sucesso!', 'success');
            }
          });
        }
      });
    }, 100);
  };

  const startEdit = (livro) => {
    setFormData({
      ...livro,
      codigo: livro.codigo || '',
      tombamento: livro.tombamento || '',
      volume: livro.volume || '',
      exemplar: livro.exemplar || '',
      nrEdicao: livro.nrEdicao || '',
      dono: livro.dono || '',
      historicoEmprestimos: livro.historicoEmprestimos || []
    });
    setEditingId(livro.id);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '', autor: '', editora: '', categoria: '', prateleira: '',
      ano: '', isbn: '', codigo: '', tombamento: '', volume: '', exemplar: '',
      nrEdicao: '', dono: '', status: 'nao-lido', favorito: false,
      emprestadoPara: '', dataEmprestimo: '', historicoEmprestimos: [],
      rating: 0, notas: '', anotacoes: '', capaUrl: ''
    });
    setEditingId(null);
  };

  const toggleFavorito = (id) => {
    const updated = livros.map(l => l.id === id ? { ...l, favorito: !l.favorito } : l);
    saveLivros(updated);
  };

  // Emprestar rápido
  const iniciarEmprestimo = (livro) => {
    setEmprestarLivro(livro);
    setEmprestarNome('');
    setShowEmprestarModal(true);
  };

  const confirmarEmprestimo = () => {
    if (!emprestarNome.trim()) {
      showToast('Informe o nome da pessoa!', 'warning');
      return;
    }
    const hoje = new Date().toISOString().split('T')[0];
    const updated = livros.map(l => l.id === emprestarLivro.id ? {
      ...l,
      status: 'emprestado',
      emprestadoPara: emprestarNome.trim(),
      dataEmprestimo: hoje
    } : l);
    saveLivros(updated);
    setShowEmprestarModal(false);
    setEmprestarLivro(null);
    showToast(`Livro emprestado para ${emprestarNome.trim()}`, 'success');
  };

  // Upload de capa
  const handleCapaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, capaUrl: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Exportar CSV
  const exportarCSV = () => {
    if (livros.length === 0) {
      showToast('Nenhum livro para exportar!', 'warning');
      return;
    }

    const headers = 'titulo,autor,editora,categoria,prateleira,ano,isbn,codigo,tombamento,volume,exemplar,nrEdicao,dono,status,favorito,emprestadoPara,dataEmprestimo,rating,notas,capaUrl\n';
    const rows = livros.map(l => {
      const escapeCsv = (str) => {
        if (!str) return '""';
        const strValue = String(str);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return `"${strValue}"`;
      };

      return [
        escapeCsv(l.titulo), escapeCsv(l.autor), escapeCsv(l.editora || ''),
        escapeCsv(l.categoria), escapeCsv(l.prateleira), escapeCsv(l.ano || ''),
        escapeCsv(l.isbn || ''), escapeCsv(l.codigo || ''), escapeCsv(l.tombamento || ''),
        escapeCsv(l.volume || ''), escapeCsv(l.exemplar || ''), escapeCsv(l.nrEdicao || ''),
        escapeCsv(l.dono || ''), escapeCsv(l.status), escapeCsv(l.favorito ? 'sim' : 'nao'),
        escapeCsv(l.emprestadoPara || ''), escapeCsv(l.dataEmprestimo || ''),
        escapeCsv(l.rating || 0), escapeCsv(l.notas || ''), escapeCsv(l.capaUrl || '')
      ].join(',');
    }).join('\n');

    const csv = '\uFEFF' + headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `biblioteca_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowCsvModal(false);
    showToast('CSV exportado com sucesso!', 'success');
  };

  // Importar CSV
  const importarCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');

      const novosLivros = [];
      let duplicatasIgnoradas = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let char of lines[i]) {
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());

        const livro = {
          id: Date.now() + i,
          titulo: values[0] || '',
          autor: values[1] || '',
          editora: values[2] || '',
          categoria: values[3] || '',
          prateleira: values[4] || '',
          ano: values[5] || '',
          isbn: values[6] || '',
          codigo: values[7] || '',
          tombamento: values[8] || '',
          volume: values[9] || '',
          exemplar: values[10] || '',
          nrEdicao: values[11] || '',
          dono: values[12] || '',
          status: values[13] || 'nao-lido',
          favorito: values[14] === 'sim',
          emprestadoPara: values[15] || '',
          dataEmprestimo: values[16] || '',
          rating: parseInt(values[17]) || 0,
          notas: values[18] || '',
          anotacoes: '',
          historicoEmprestimos: [],
          capaUrl: values[19] || ''
        };

        if (livro.titulo && livro.autor) {
          const tituloNorm = livro.titulo.trim().toUpperCase();
          const jaExiste = livros.find(l => l.titulo.trim().toUpperCase() === tituloNorm);
          const jaNoLote = novosLivros.find(l => l.titulo.trim().toUpperCase() === tituloNorm);

          if (jaExiste || jaNoLote) {
            duplicatasIgnoradas++;
          } else {
            novosLivros.push(livro);
          }
        }
      }

      saveLivros([...livros, ...novosLivros]);
      setShowImportModal(false);
      setShowCsvModal(false);

      let msg = `${novosLivros.length} livros importados com sucesso!`;
      if (duplicatasIgnoradas > 0) {
        msg += ` (${duplicatasIgnoradas} duplicata(s) ignorada(s))`;
      }
      showToast(msg, 'success');
    };
    reader.readAsText(file);
  };

  const baixarTemplate = () => {
    const template = 'titulo,autor,editora,categoria,prateleira,ano,isbn,codigo,tombamento,volume,exemplar,nrEdicao,dono,status,favorito,emprestadoPara,dataEmprestimo,rating,notas,capaUrl\n"O Hobbit","J.R.R. Tolkien","HarperCollins","FICÇÃO / LITERATURA","PRATELEIRA A","1937","9788595084742","001","100.1","1","1","1","","lido","sim","","","5","Livro incrível","https://exemplo.com/capa.jpg"';
    const blob = new Blob(['\uFEFF' + template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'template_biblioteca.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Ciclar entre modos de visualização
  const toggleSection = (key) => {
    setExpandedSections(prev => {
      if (prev[key]) return { ...prev, [key]: false };
      const closed = {};
      Object.keys(prev).forEach(k => { closed[k] = false; });
      closed[key] = true;
      return closed;
    });
  };

  const toggleViewMode = () => {
    const modes = ['lista', 'grid', 'prateleira'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  const viewModeConfig = {
    'lista': { icon: List, label: 'Lista' },
    'grid': { icon: LayoutGrid, label: 'Grid' },
    'prateleira': { icon: Layers, label: 'Prateleira' }
  };

  // Ordenar livros
  const ordenarLivros = (livrosArray) => {
    const [campo, direcao] = config.ordenacao.split('-');

    return [...livrosArray].sort((a, b) => {
      let compareA, compareB;

      switch(campo) {
        case 'titulo':
          compareA = a.titulo.toLowerCase();
          compareB = b.titulo.toLowerCase();
          break;
        case 'autor':
          compareA = a.autor.toLowerCase();
          compareB = b.autor.toLowerCase();
          break;
        case 'rating':
          compareA = a.rating || 0;
          compareB = b.rating || 0;
          break;
        case 'ano':
          compareA = a.ano || '0';
          compareB = b.ano || '0';
          break;
        case 'adicionado':
          compareA = a.id;
          compareB = b.id;
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return direcao === 'asc' ? -1 : 1;
      if (compareA > compareB) return direcao === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filtrar livros
  const livrosFiltrados = ordenarLivros(livros.filter(livro => {
    const matchSearch = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (livro.codigo && livro.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (livro.editora && livro.editora.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchPrateleira = !filtros.prateleira || livro.prateleira === filtros.prateleira;
    const matchCategoria = !filtros.categoria || livro.categoria === filtros.categoria;
    const matchStatus = !filtros.status || livro.status === filtros.status;
    const matchAutor = !filtros.autor || livro.autor === filtros.autor;
    const matchFavorito = !filtros.favorito || livro.favorito === true;

    return matchSearch && matchPrateleira && matchCategoria && matchStatus && matchAutor && matchFavorito;
  }));

  // Obter valores únicos para filtros
  const prateleirasUnicas = [...new Set(livros.map(l => l.prateleira))].filter(Boolean).sort();
  const categoriasUnicas = [...new Set(livros.map(l => l.categoria))].filter(Boolean).sort();
  const autoresUnicos = [...new Set(livros.map(l => l.autor))].filter(Boolean).sort();

  // Todas as categorias (predefinidas + as que existem nos livros)
  const todasCategorias = [...new Set([...CATEGORIAS_PREDEFINIDAS, ...categoriasUnicas])].sort();
  const todasPrateleiras = [...new Set([...PRATELEIRAS_PREDEFINIDAS, ...prateleirasUnicas])].sort();

  // Agrupar por prateleira
  const livrosPorPrateleira = livrosFiltrados.reduce((acc, livro) => {
    const prat = livro.prateleira || 'Sem prateleira';
    if (!acc[prat]) acc[prat] = [];
    acc[prat].push(livro);
    return acc;
  }, {});

  // Alfabeto para scroll
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  const groupedByLetter = livrosFiltrados.reduce((acc, livro) => {
    const firstLetter = livro.titulo[0]?.toUpperCase() || '#';
    const letter = alphabet.includes(firstLetter) ? firstLetter : '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(livro);
    return acc;
  }, {});

  const temFiltrosAtivos = filtros.prateleira || filtros.categoria || filtros.status || filtros.autor || filtros.favorito;

  const themeColors = config.darkMode ? {
    bg: '#1a1a1a',
    bgSecondary: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    card: '#2d2d2d',
    cardAlt: '#363636',
    border: '#404040',
    accentText: '#ffffff'
  } : {
    bg: '#f9f9f9',
    bgSecondary: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    card: '#ffffff',
    cardAlt: '#f5f5f5',
    border: '#e0e0e0',
    accentText: '#00407a'
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${fontSizeClasses[config.fontSize]}`} style={{ backgroundColor: themeColors.bg, color: themeColors.text, maxHeight: '100vh', minHeight: '100vh' }}>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} key={toast.key} />}

      {/* Header */}
      <div className="px-4 pt-16 pb-4" style={{ backgroundColor: '#00407a' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Acervo</h1>
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 bg-white bg-opacity-20 rounded-lg"
          >
            <Menu size={22} className="text-white" />
          </button>
        </div>

        {/* Filtros + Modos Visualização */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            className={`flex-1 p-2 rounded-lg text-white text-sm flex items-center justify-center gap-1 ${showFiltros ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20'} ${temFiltrosAtivos ? 'font-bold' : ''}`}
          >
            <Filter size={16} fill={temFiltrosAtivos ? 'white' : 'none'} /> Filtros
          </button>
          <button
            onClick={toggleViewMode}
            className="flex-1 p-2 rounded-lg bg-white bg-opacity-20 flex items-center justify-center gap-2 text-white text-sm"
          >
            {(() => {
              const ViewIcon = viewModeConfig[viewMode].icon;
              return <ViewIcon size={16} />;
            })()}
            <span>{viewModeConfig[viewMode].label}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por título, autor, código ou editora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 transition"
          />
        </div>

        {/* Filtros expandidos */}
        {showFiltros && (
          <div className="mt-3 space-y-2 bg-white bg-opacity-10 p-3 rounded-lg">
            <button
              onClick={() => setFiltros({...filtros, favorito: !filtros.favorito})}
              className="w-full p-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition"
              style={{
                backgroundColor: filtros.favorito ? '#ffffff' : 'rgba(255,255,255,0.2)',
                color: filtros.favorito ? '#00407a' : '#ffffff'
              }}
            >
              <Heart size={16} fill={filtros.favorito ? 'red' : 'none'} className={filtros.favorito ? 'text-red-500' : 'text-white'} />
              Apenas Favoritos
            </button>
            <select value={filtros.prateleira} onChange={(e) => setFiltros({...filtros, prateleira: e.target.value})} className="w-full p-2 rounded bg-white text-gray-800 text-sm">
              <option value="">Todas as prateleiras</option>
              {prateleirasUnicas.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filtros.categoria} onChange={(e) => setFiltros({...filtros, categoria: e.target.value})} className="w-full p-2 rounded bg-white text-gray-800 text-sm">
              <option value="">Todas as categorias</option>
              {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filtros.status} onChange={(e) => setFiltros({...filtros, status: e.target.value})} className="w-full p-2 rounded bg-white text-gray-800 text-sm">
              <option value="">Todos os status</option>
              {Object.entries(statusConfig).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
            </select>
            <select value={filtros.autor} onChange={(e) => setFiltros({...filtros, autor: e.target.value})} className="w-full p-2 rounded bg-white text-gray-800 text-sm">
              <option value="">Todos os autores</option>
              {autoresUnicos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {temFiltrosAtivos && (
              <button onClick={() => setFiltros({prateleira: '', categoria: '', status: '', autor: '', favorito: false})} className="w-full p-2 bg-red-500 bg-opacity-70 text-white rounded text-sm">
                Limpar Filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Menu Hamburguer */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMenu(false)} />
          <div className="relative w-80 rounded-xl shadow-xl flex flex-col overflow-hidden" style={{ backgroundColor: themeColors.bgSecondary }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: themeColors.border }}>
              <span className="font-bold text-lg" style={{ color: themeColors.text }}>Menu</span>
              <button onClick={() => setShowMenu(false)} className="p-1">
                <X size={20} style={{ color: themeColors.text }} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => { setShowMenu(false); setShowConfigModal(true); }}
                className="w-full p-3 rounded-lg text-left flex items-center gap-3 transition"
                style={{ color: themeColors.text }}
              >
                <Settings size={20} style={{ color: themeColors.accentText }} />
                Configurações
              </button>
              <button
                onClick={() => { setShowMenu(false); setShowCsvModal(true); }}
                className="w-full p-3 rounded-lg text-left flex items-center gap-3 transition"
                style={{ color: themeColors.text }}
              >
                <Download size={20} style={{ color: themeColors.accentText }} />
                Gerenciar CSV
              </button>
            </div>
            <div className="p-4 border-t text-center" style={{ borderColor: themeColors.border }}>
              <span className="text-xs" style={{ color: themeColors.textSecondary }}>Leonardo Rejani | v1.0.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Submenu toggle */}
      <div className="border-b" style={{ backgroundColor: themeColors.bgSecondary, borderColor: themeColors.border }}>
        <button
          onClick={() => setShowAcoes(!showAcoes)}
          className="w-full py-2 flex items-center justify-center gap-1 text-xs font-medium transition"
          style={{ color: themeColors.textSecondary }}
        >
          Ações
          <ChevronDown size={14} className={`transition-transform ${showAcoes ? 'rotate-180' : ''}`} />
        </button>
        {showAcoes && (
          <div className="px-4 pb-3 flex gap-2">
            {livros.length > 0 && (
              <button onClick={() => setShowDeleteMultipleModal(true)} className="px-3 py-3 rounded-lg bg-red-500 text-white font-medium flex items-center gap-1">
                <Trash2 size={18} />
              </button>
            )}
            <button onClick={() => { resetForm(); setShowAddModal(true); }} className="flex-1 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2" style={{ backgroundColor: '#00407a' }}>
              <Plus size={20} /> Adicionar Livro
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-x-hidden">
        <div ref={listRef} className={`h-full overflow-y-auto px-4 py-4 ${densidadeClasses[config.densidade]}`}>
        {livrosFiltrados.length === 0 ? (
          <div className="text-center py-12" style={{ color: themeColors.textSecondary }}>
            {searchTerm || temFiltrosAtivos ? 'Nenhum livro encontrado com esses filtros' : 'Adicione seu primeiro livro'}
          </div>
        ) : viewMode === 'lista' ? (
          // LISTA COM ALFABETO
          <div className="pr-5">
            {Object.keys(groupedByLetter).sort().map(letter => (
              <div key={letter} id={`section-lista-${letter}`} className="mb-2">
                <button
                  onClick={() => toggleSection(`lista-${letter}`)}
                  className="w-full py-3 px-3 text-sm font-semibold text-white shadow-md rounded-lg flex items-center justify-between"
                  style={{ backgroundColor: '#00407a' }}
                >
                  <div className="flex items-center gap-2">
                    <span>Inicial</span>
                    <span className="px-2 py-1 rounded-md text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#00407a' }}>{letter}</span>
                  </div>
                  <span className="px-2 py-1 rounded-md text-xs font-bold" style={{ backgroundColor: '#4fc3f7', color: '#00407a' }}>{groupedByLetter[letter].length} livros</span>
                </button>
                {expandedSections[`lista-${letter}`] && (
                  <div className={`mt-1 ${densidadeClasses[config.densidade]}`}>
                    {groupedByLetter[letter].map(livro => (
                      <LivroCard
                        key={livro.id}
                        livro={livro}
                        onEdit={startEdit}
                        onToggleFavorito={toggleFavorito}
                        onEmprestar={iniciarEmprestimo}
                        onShowHistorico={(l) => { setHistoricoLivro(l); setShowHistoricoModal(true); }}
                        onShowNotas={(l) => { setSelectedLivroNotas(l); setShowNotasModal(true); }}
                        statusConfig={statusConfig}
                        themeColors={themeColors}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          // GRID - Livros soltos com capas, barra azul entre prateleiras
          <div className="pr-5">
            {Object.entries(livrosPorPrateleira).sort().map(([prateleira, livrosDaPrateleira], pratIndex) => {
              const pratLetra = prateleira.replace('PRATELEIRA ', '').charAt(0);
              return (
              <div key={prateleira} id={`section-grid-${pratLetra}`}>
                {/* Barra azul separadora */}
                <div
                  className="w-full py-3 px-3 text-sm font-semibold text-white flex items-center justify-between mb-3 rounded-lg"
                  style={{ backgroundColor: '#00407a', marginTop: pratIndex > 0 ? '16px' : '0' }}
                >
                  <span>{prateleira}</span>
                  <span className="px-2 py-1 rounded-md text-xs font-bold" style={{ backgroundColor: '#4fc3f7', color: '#00407a' }}>{livrosDaPrateleira.length} livros</span>
                </div>
                {/* Grid de capas - sempre visível */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 pb-2">
                    {livrosDaPrateleira.map(livro => (
                      <LivroCardGrid
                        key={livro.id}
                        livro={livro}
                        onClick={setDetalheLivro}
                        statusConfig={statusConfig}
                        themeColors={themeColors}
                      />
                    ))}
                </div>
              </div>
            ); })}
          </div>
        ) : (
          // PRATELEIRA - Visão geral com retângulos
          <div className="pr-5">
            {Object.entries(livrosPorPrateleira).sort().map(([prateleira, livrosDaPrateleira]) => {
              const pratLetra = prateleira.replace('PRATELEIRA ', '').charAt(0);
              const isExpanded = expandedSections[`prat-${prateleira}`];
              return (
                <div key={prateleira} id={`section-prat-${pratLetra}`} className="mb-3">
                  <button
                    onClick={() => toggleSection(`prat-${prateleira}`)}
                    className="w-full py-3 px-3 text-sm font-semibold text-white shadow-md rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: '#00407a' }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{pratLetra}</span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ backgroundColor: '#4fc3f7', color: '#00407a' }}>{livrosDaPrateleira.length} livros</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      {livrosDaPrateleira.map(livro => (
                        <LivroCard
                          key={livro.id}
                          livro={livro}
                          onClick={setDetalheLivro}
                          statusConfig={statusConfig}
                          themeColors={themeColors}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* Índice Alfabético Lateral - não aparece no modo prateleira */}
        {livrosFiltrados.length > 0 && viewMode !== 'prateleira' && (() => {
          const prefix = viewMode === 'lista' ? 'section-lista-' : 'section-grid-';
          const letters = viewMode === 'lista'
            ? Object.keys(groupedByLetter).sort()
            : [...new Set(Object.keys(livrosPorPrateleira).map(p => p.replace('PRATELEIRA ', '').charAt(0)))].sort();

          const scrollToLetter = (letter) => {
            const el = listRef.current?.querySelector(`#${prefix}${letter}`);
            if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
          };

          const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            if (el?.dataset?.letter) scrollToLetter(el.dataset.letter);
          };

          return (
            <div
              className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center z-40 px-1 select-none"
              style={{ touchAction: 'pan-y' }}
              onTouchMove={handleTouchMove}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                if (el?.dataset?.letter) scrollToLetter(el.dataset.letter);
              }}
            >
              {letters.map(letter => (
                <div
                  key={letter}
                  data-letter={letter}
                  onClick={() => scrollToLetter(letter)}
                  className="text-xs font-bold cursor-pointer leading-tight py-0.5 px-1"
                  style={{ color: themeColors.accentText, fontSize: '10px' }}
                >
                  {letter}
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Modal Add/Edit */}
      {showAddModal && (
        <Modal onClose={() => { setShowAddModal(false); resetForm(); }} themeColors={themeColors}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.accentText }}>
            {editingId ? 'Editar Livro' : 'Novo Livro'}
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            <input type="text" placeholder="Título *" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />

            <input type="text" placeholder="Autor *" value={formData.autor} onChange={(e) => setFormData({...formData, autor: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />

            <input type="text" placeholder="Editora" value={formData.editora} onChange={(e) => setFormData({...formData, editora: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Categoria</label>
                <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
                  <option value="">Selecione...</option>
                  {todasCategorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Localização</label>
                <select value={formData.prateleira} onChange={(e) => setFormData({...formData, prateleira: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
                  <option value="">Selecione...</option>
                  {todasPrateleiras.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Código</label>
                <input type="text" placeholder="Ex: 001426" value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Tombamento</label>
                <input type="text" placeholder="Ex: 320.5" value={formData.tombamento} onChange={(e) => setFormData({...formData, tombamento: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Ano Edição</label>
                <input type="text" placeholder="Ex: 2003" value={formData.ano} onChange={(e) => setFormData({...formData, ano: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Volume</label>
                <input type="text" placeholder="Ex: 1" value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Exemplar</label>
                <input type="text" placeholder="Ex: 1" value={formData.exemplar} onChange={(e) => setFormData({...formData, exemplar: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: themeColors.textSecondary }}>Nr. Edição</label>
                <input type="text" placeholder="Ex: 1" value={formData.nrEdicao} onChange={(e) => setFormData({...formData, nrEdicao: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="ISBN (opcional)" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              <input type="text" placeholder="Dono" value={formData.dono} onChange={(e) => setFormData({...formData, dono: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
            </div>

            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-3 border rounded focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>

            {formData.status === 'emprestado' && (
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Emprestado para" value={formData.emprestadoPara} onChange={(e) => setFormData({...formData, emprestadoPara: e.target.value})} className="p-3 border rounded" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
                <input type="date" value={formData.dataEmprestimo} onChange={(e) => setFormData({...formData, dataEmprestimo: e.target.value})} className="p-3 border rounded" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: themeColors.textSecondary }}>Avaliação:</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setFormData({...formData, rating: n})} className="focus:outline-none">
                  <Star size={24} className={n <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>

            <textarea placeholder="Notas pessoais (resumo, citações...)" value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} className="w-full p-3 border rounded h-20 resize-none focus:outline-none focus:ring-2" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }} />

            <div>
              <label className="block text-sm mb-2" style={{ color: themeColors.textSecondary }}>Capa do livro:</label>
              <input type="file" accept="image/*" onChange={handleCapaUpload} className="w-full text-sm" style={{ color: themeColors.text }} />
              {formData.capaUrl && (
                <div className="mt-2 relative w-24 h-32">
                  <img src={formData.capaUrl} alt="Capa" className="w-full h-full object-cover rounded shadow" />
                  <button onClick={() => setFormData({...formData, capaUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <XCircle size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {editingId && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteLivro(editingId);
                }}
                className="px-4 py-3 bg-red-500 text-white rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 py-3 border rounded-lg"
              style={{ borderColor: themeColors.border, color: themeColors.text }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editingId ? updateLivro() : addLivro();
              }}
              className="flex-1 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#00407a' }}
            >
              {editingId ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal CSV */}
      {showCsvModal && (
        <Modal onClose={() => setShowCsvModal(false)} themeColors={themeColors}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: themeColors.accentText }}>Gerenciar CSV</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={exportarCSV}
              className="p-6 border-2 rounded-lg transition flex flex-col items-center gap-3"
              style={{ borderColor: themeColors.accentText, backgroundColor: themeColors.card }}
            >
              <Download size={40} style={{ color: themeColors.accentText }} />
              <div className="text-center">
                <p className="font-bold" style={{ color: themeColors.accentText }}>Exportar</p>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Baixar todos os livros</p>
              </div>
            </button>

            <button
              onClick={() => { setShowCsvModal(false); setShowImportModal(true); }}
              className="p-6 border-2 rounded-lg transition flex flex-col items-center gap-3"
              style={{ borderColor: themeColors.accentText, backgroundColor: themeColors.card }}
            >
              <Upload size={40} style={{ color: themeColors.accentText }} />
              <div className="text-center">
                <p className="font-bold" style={{ color: themeColors.accentText }}>Importar</p>
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>Adicionar de arquivo</p>
              </div>
            </button>
          </div>

          <button
            onClick={baixarTemplate}
            className="w-full py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Download size={20} /> Baixar Template CSV
          </button>
        </Modal>
      )}

      {/* Modal Import Detalhado */}
      {showImportModal && (
        <Modal onClose={() => { setShowImportModal(false); setShowCsvModal(true); }} themeColors={themeColors}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.accentText }}>Importar Livros (CSV)</h2>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">📋 Formato do CSV:</h3>
              <p className="text-sm text-yellow-700 mb-2">O arquivo CSV deve ter EXATAMENTE estas colunas nesta ordem:</p>
              <code className="block bg-yellow-100 p-2 rounded text-xs overflow-x-auto">
                titulo,autor,editora,categoria,prateleira,ano,isbn,codigo,tombamento,volume,exemplar,nrEdicao,dono,status,favorito,emprestadoPara,dataEmprestimo,rating,notas,capaUrl
              </code>

              <div className="mt-3 text-sm text-yellow-700 space-y-1">
                <p><strong>Campos obrigatórios:</strong> titulo, autor</p>
                <p><strong>Status válidos:</strong> nao-lido, lendo, lido, emprestado</p>
                <p><strong>Favorito:</strong> sim ou nao</p>
                <p><strong>Rating:</strong> número de 0 a 5</p>
                <p><strong>capaUrl:</strong> URL da imagem de capa (opcional)</p>
                <p><strong>Duplicatas:</strong> Livros com título já existente serão ignorados</p>
              </div>
            </div>

            <div className="border-t pt-4" style={{ borderColor: themeColors.border }}>
              <label className="block text-center">
                <input type="file" accept=".csv" onChange={importarCSV} className="hidden" />
                <div className="py-8 border-2 border-dashed rounded-lg cursor-pointer" style={{ borderColor: themeColors.accentText, backgroundColor: themeColors.card }}>
                  <Upload size={40} className="mx-auto mb-2" style={{ color: themeColors.accentText }} />
                  <p className="font-medium" style={{ color: themeColors.accentText }}>Clique para selecionar arquivo CSV</p>
                  <p className="text-sm mt-1" style={{ color: themeColors.textSecondary }}>Ou arraste e solte aqui</p>
                </div>
              </label>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Configurações */}
      {showConfigModal && (
        <Modal onClose={() => setShowConfigModal(false)} themeColors={themeColors} large>
          <h2 className="text-2xl font-bold mb-6" style={{ color: themeColors.accentText }}>Configurações</h2>

          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {/* Aparência */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: themeColors.text }}>
                {config.darkMode ? <Moon size={20} /> : <Sun size={20} />} Aparência
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded" style={{ borderColor: themeColors.border }}>
                  <span style={{ color: themeColors.text }}>Modo Escuro</span>
                  <button
                    onClick={() => saveConfig({...config, darkMode: !config.darkMode})}
                    className={`w-12 h-6 rounded-full transition ${config.darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${config.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: themeColors.textSecondary }}>Tamanho da Fonte:</label>
                  <select value={config.fontSize} onChange={(e) => saveConfig({...config, fontSize: e.target.value})} className="w-full p-3 border rounded" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: themeColors.textSecondary }}>Visualização Padrão:</label>
                  <select value={config.defaultView} onChange={(e) => saveConfig({...config, defaultView: e.target.value})} className="w-full p-3 border rounded" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
                    <option value="lista">Lista</option>
                    <option value="grid">Grid</option>
                    <option value="prateleira">Prateleira</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: themeColors.textSecondary }}>Densidade dos Cards:</label>
                  <select value={config.densidade} onChange={(e) => saveConfig({...config, densidade: e.target.value})} className="w-full p-3 border rounded" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
                    <option value="compacto">Compacto</option>
                    <option value="normal">Normal</option>
                    <option value="espacado">Espaçado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <h3 className="font-bold mb-3" style={{ color: themeColors.text }}>Ordenação Padrão</h3>
              <select value={config.ordenacao} onChange={(e) => saveConfig({...config, ordenacao: e.target.value})} className="w-full p-3 border rounded" style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}>
                <option value="titulo-asc">Título (A-Z)</option>
                <option value="titulo-desc">Título (Z-A)</option>
                <option value="autor-asc">Autor (A-Z)</option>
                <option value="autor-desc">Autor (Z-A)</option>
                <option value="rating-desc">Melhor Avaliados</option>
                <option value="rating-asc">Pior Avaliados</option>
                <option value="ano-desc">Ano (Mais Recente)</option>
                <option value="ano-asc">Ano (Mais Antigo)</option>
                <option value="adicionado-desc">Adicionados Recentemente</option>
                <option value="adicionado-asc">Adicionados Primeiro</option>
              </select>
            </div>

            {/* Dados */}
            <div>
              <h3 className="font-bold mb-3 text-red-600">Gerenciar Dados</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded" style={{ borderColor: themeColors.border }}>
                  <p className="text-sm mb-2" style={{ color: themeColors.textSecondary }}>
                    Total: {livros.length} livros • {prateleirasUnicas.length} prateleiras
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    limparTodosDados();
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-lg font-medium"
                >
                  🚨 Apagar Todos os Dados
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Histórico de Empréstimos */}
      {showHistoricoModal && historicoLivro && (
        <Modal onClose={() => { setShowHistoricoModal(false); setHistoricoLivro(null); }} themeColors={themeColors}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: themeColors.accentText }}>
            <History size={24} /> Histórico de Empréstimos
          </h2>
          <h3 className="text-lg mb-4" style={{ color: themeColors.text }}>{historicoLivro.titulo}</h3>

          {(!historicoLivro.historicoEmprestimos || historicoLivro.historicoEmprestimos.length === 0) ? (
            <p className="text-center py-8" style={{ color: themeColors.textSecondary }}>
              Este livro nunca foi emprestado.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {historicoLivro.historicoEmprestimos.map((emp, idx) => (
                <div key={idx} className="p-4 border rounded-lg" style={{ borderColor: themeColors.border, backgroundColor: themeColors.card }}>
                  <p className="font-bold" style={{ color: themeColors.text }}>👤 {emp.pessoa}</p>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                    📅 Emprestado: {emp.dataEmprestimo ? new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR') : '-'}
                  </p>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                    ✅ Devolvido: {emp.dataDevolucao ? new Date(emp.dataDevolucao).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Modal Bloco de Notas */}
      {showNotasModal && selectedLivroNotas && (
        <Modal onClose={() => { setShowNotasModal(false); setSelectedLivroNotas(null); }} themeColors={themeColors} large>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: themeColors.accentText }}>
            <StickyNote size={24} /> Anotações
          </h2>
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: config.darkMode ? '#404040' : '#f0f0f0' }}>
            <p className="font-bold" style={{ color: themeColors.text }}>{selectedLivroNotas.titulo}</p>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>{selectedLivroNotas.autor}</p>
            {selectedLivroNotas.ano && <p className="text-xs" style={{ color: themeColors.textSecondary }}>📅 {selectedLivroNotas.ano}</p>}
          </div>

          <textarea
            placeholder="Digite suas anotações aqui..."
            value={selectedLivroNotas.anotacoes || ''}
            onChange={(e) => {
              const updated = livros.map(l => l.id === selectedLivroNotas.id ? {...l, anotacoes: e.target.value} : l);
              saveLivros(updated);
              setSelectedLivroNotas({...selectedLivroNotas, anotacoes: e.target.value});
            }}
            className="w-full p-4 border rounded h-64 resize-none focus:outline-none focus:ring-2"
            style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}
          />

          <button
            onClick={() => { setShowNotasModal(false); setSelectedLivroNotas(null); }}
            className="w-full mt-4 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#00407a' }}
          >
            Salvar e Fechar
          </button>
        </Modal>
      )}

      {/* Modal Deletar Múltiplos */}
      {showDeleteMultipleModal && (
        <Modal onClose={() => { setShowDeleteMultipleModal(false); setSelectedForDelete([]); setDeleteSearchTerm(''); }} themeColors={themeColors}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.text }}>Deletar Múltiplos Livros</h2>
          <p className="mb-4" style={{ color: themeColors.textSecondary }}>Selecione os livros que deseja deletar:</p>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar livro..."
              value={deleteSearchTerm}
              onChange={(e) => setDeleteSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text }}
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedForDelete(livros.map(l => l.id));
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
            >
              Selecionar Todos
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedForDelete([]);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
            >
              Limpar Seleção
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
            {livros.filter(l => {
              if (!deleteSearchTerm) return true;
              const term = deleteSearchTerm.toLowerCase();
              return l.titulo.toLowerCase().includes(term) || l.autor.toLowerCase().includes(term);
            }).map(livro => (
              <label
                key={livro.id}
                className="flex items-center gap-3 p-3 border rounded cursor-pointer transition"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: selectedForDelete.includes(livro.id) ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedForDelete.includes(livro.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedForDelete([...selectedForDelete, livro.id]);
                    } else {
                      setSelectedForDelete(selectedForDelete.filter(id => id !== livro.id));
                    }
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-bold" style={{ color: themeColors.text }}>{livro.titulo}</p>
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>{livro.autor}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteMultipleModal(false);
                setSelectedForDelete([]);
              }}
              className="flex-1 py-3 border rounded-lg transition"
              style={{ borderColor: themeColors.border, color: themeColors.text }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteMultipleLivros();
              }}
              disabled={selectedForDelete.length === 0}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Deletar {selectedForDelete.length > 0 && `(${selectedForDelete.length})`}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Detalhe do Livro (Grid) */}
      {detalheLivro && (
        <Modal onClose={() => setDetalheLivro(null)} themeColors={themeColors}>
          <div className="flex flex-col items-center">
            {detalheLivro.capaUrl ? (
              <img src={detalheLivro.capaUrl} alt={detalheLivro.titulo} className="w-40 h-60 object-cover rounded-lg shadow-md mb-4" />
            ) : (
              <div className="w-40 h-60 flex items-center justify-center rounded-lg shadow-md mb-4" style={{ backgroundColor: themeColors.border }}>
                <BookOpen size={48} className="text-gray-400" />
              </div>
            )}
            <h2 className="text-xl font-bold text-center mb-1" style={{ color: themeColors.text }}>{detalheLivro.titulo}</h2>
            <p className="text-sm mb-1" style={{ color: themeColors.textSecondary }}>{detalheLivro.autor}</p>
            {detalheLivro.editora && <p className="text-xs mb-3" style={{ color: themeColors.textSecondary }}>{detalheLivro.editora}</p>}

            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className={`${(statusConfig[detalheLivro.status] || statusConfig['nao-lido']).color} text-white text-xs px-3 py-1 rounded-full`}>
                {(statusConfig[detalheLivro.status] || statusConfig['nao-lido']).label}
              </span>
              {detalheLivro.categoria && (
                <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">{detalheLivro.categoria}</span>
              )}
              {detalheLivro.prateleira && (
                <span className="text-white text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#00407a' }}>{detalheLivro.prateleira}</span>
              )}
            </div>

            {detalheLivro.rating > 0 && (
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < detalheLivro.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
            )}

            {detalheLivro.status === 'emprestado' && detalheLivro.emprestadoPara && (
              <p className="text-sm text-orange-600 mb-4">Emprestado para: {detalheLivro.emprestadoPara}</p>
            )}

            {detalheLivro.notas && (
              <p className="text-sm text-center mb-4" style={{ color: themeColors.textSecondary }}>{detalheLivro.notas}</p>
            )}

            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => { toggleFavorito(detalheLivro.id); setDetalheLivro({...detalheLivro, favorito: !detalheLivro.favorito}); }}
                className="flex-1 py-3 border rounded-lg font-medium flex items-center justify-center gap-2 transition"
                style={{ borderColor: themeColors.border, color: themeColors.text }}
              >
                <Heart size={18} fill={detalheLivro.favorito ? 'red' : 'none'} className={detalheLivro.favorito ? 'text-red-500' : 'text-gray-400'} />
                {detalheLivro.favorito ? 'Favoritado' : 'Favoritar'}
              </button>
              <button
                onClick={() => { setDetalheLivro(null); startEdit(detalheLivro); }}
                className="flex-1 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: '#00407a' }}
              >
                <Edit2 size={18} /> Editar
              </button>
            </div>
            {detalheLivro.status !== 'emprestado' && (
              <button
                onClick={() => { setDetalheLivro(null); iniciarEmprestimo(detalheLivro); }}
                className="w-full mt-2 py-3 bg-yellow-100 text-yellow-700 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <BookOpen size={18} /> Emprestei pra alguém
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Modal Emprestar Rápido */}
      {showEmprestarModal && emprestarLivro && (
        <Modal onClose={() => setShowEmprestarModal(false)} themeColors={themeColors}>
          <h2 className="text-xl font-bold mb-2" style={{ color: themeColors.accentText }}>Emprestar Livro</h2>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>"{emprestarLivro.titulo}"</p>
          <input
            type="text"
            placeholder="Nome de quem vai levar"
            value={emprestarNome}
            onChange={(e) => setEmprestarNome(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmarEmprestimo()}
            autoFocus
            className="w-full p-3 border rounded-lg mb-4 text-lg focus:outline-none focus:ring-2"
            style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.text, focusRingColor: '#00407a' }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmprestarModal(false)}
              className="flex-1 py-3 border rounded-lg font-medium"
              style={{ borderColor: themeColors.border, color: themeColors.text }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarEmprestimo}
              className="flex-1 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#00407a' }}
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}

      {/* Confirm Dialog - rendered last to guarantee it's on top of everything */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          confirmColor="#dc2626"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
          themeColors={themeColors}
        />
      )}
    </div>
  );
}

// Componente Card Lista
function LivroCard({ livro, onEdit, onToggleFavorito, onShowHistorico, onShowNotas, onEmprestar, statusConfig, compact = false, altBg = false, themeColors }) {
  const status = statusConfig[livro.status] || statusConfig['nao-lido'];

  return (
    <div className="rounded-lg shadow-sm p-4 transition" style={{ backgroundColor: altBg ? themeColors.cardAlt : themeColors.card }}>
      <div className="flex gap-3">
        {livro.capaUrl && !compact && (
          <img src={livro.capaUrl} alt={livro.titulo} className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold truncate" style={{ color: themeColors.text }}>{livro.titulo}</h3>
              </div>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>{livro.autor}</p>
              {livro.editora && <p className="text-xs" style={{ color: themeColors.textSecondary }}>{livro.editora}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => onToggleFavorito(livro.id)} className="p-2 rounded">
                <Heart size={16} fill={livro.favorito ? 'red' : 'none'} className={livro.favorito ? 'text-red-500' : 'text-gray-400'} />
              </button>
              <button onClick={() => onEdit(livro)} className="p-2 rounded">
                <Edit2 size={16} style={{ color: themeColors.accentText }} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <span className={`${status.color} text-white px-2 py-1 rounded-full`}>
              {status.label}
            </span>
            {livro.categoria && (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {livro.categoria}
              </span>
            )}
          </div>

          {!compact && (
            <>
              {livro.rating > 0 && (
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < livro.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              )}

              {livro.status === 'emprestado' && livro.emprestadoPara && (
                <p className="text-xs text-orange-600 mb-2">👤 Emprestado para: {livro.emprestadoPara}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {livro.status !== 'emprestado' && (
                  <button onClick={() => onEmprestar(livro)} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
                    <BookOpen size={12} /> Emprestei
                  </button>
                )}
                {livro.historicoEmprestimos && livro.historicoEmprestimos.length > 0 && (
                  <button onClick={() => onShowHistorico(livro)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1">
                    <History size={12} /> Histórico ({livro.historicoEmprestimos.length})
                  </button>
                )}
                <button onClick={() => onShowNotas(livro)} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                  <StickyNote size={12} /> {livro.anotacoes ? 'Ver Anotações' : 'Adicionar Anotações'}
                </button>
              </div>

              {livro.notas && (
                <p className="text-xs mt-2 line-clamp-2" style={{ color: themeColors.textSecondary }}>{livro.notas}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente Card Grid
function LivroCardGrid({ livro, onClick, statusConfig, themeColors }) {
  const status = statusConfig[livro.status] || statusConfig['nao-lido'];

  return (
    <div
      className="rounded-lg shadow-sm overflow-hidden transition cursor-pointer"
      style={{ backgroundColor: themeColors.card }}
      onClick={() => onClick(livro)}
    >
      <div className="relative aspect-[2/3] bg-gray-200">
        {livro.capaUrl ? (
          <img src={livro.capaUrl} alt={livro.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: themeColors.border }}>
            <BookOpen size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`${status.color} text-white text-xs px-2 py-1 rounded-full shadow`}>
            {status.label}
          </span>
          {livro.favorito && (
            <span className="bg-white text-xs px-1.5 py-1 rounded-full shadow">
              <Heart size={12} fill="red" className="text-red-500 inline" />
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate" title={livro.titulo} style={{ color: themeColors.text }}>{livro.titulo}</h3>
        <p className="text-xs truncate" style={{ color: themeColors.textSecondary }}>{livro.autor}</p>
      </div>
    </div>
  );
}

// Componente Modal
function Modal({ children, onClose, themeColors, large = false }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div
        className={`rounded-lg ${large ? 'max-w-3xl' : 'max-w-2xl'} w-full my-8 p-6`}
        style={{ backgroundColor: themeColors?.bgSecondary || '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
